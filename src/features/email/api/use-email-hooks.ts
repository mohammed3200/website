import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

// Type definitions for test email
type TestEmailResponseType = InferResponseType<
  (typeof client.api.email)["test"]["$post"],
  200
>;
type TestEmailRequestType = InferRequestType<
  (typeof client.api.email)["test"]["$post"]
>["json"];

// Type definitions for monitor
type MonitorResponseType = InferResponseType<
  (typeof client.api.email)["monitor"]["$get"],
  200
>;
type MonitorRequestType = InferRequestType<
  (typeof client.api.email)["monitor"]["$get"]
>["query"];

// Type definitions for monitor actions
type MonitorActionResponseType = InferResponseType<
  (typeof client.api.email)["monitor"]["action"]["$post"],
  200
>;
type MonitorActionRequestType = InferRequestType<
  (typeof client.api.email)["monitor"]["action"]["$post"]
>["json"];

// Type definitions for status update
type StatusUpdateResponseType = InferResponseType<
  (typeof client.api.email)["status"]["$patch"],
  200
>;
type StatusUpdateRequestType = InferRequestType<
  (typeof client.api.email)["status"]["$patch"]
>["json"];

/**
 * Hook for sending test emails
 */
export const useTestEmail = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<TestEmailResponseType, Error, TestEmailRequestType>({
    mutationFn: async (data) => {
      const response = await client.api.email.test["$post"]({
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send test email");
      }

      return await response.json() as TestEmailResponseType;
    },
    onSuccess: (data) => {
      toast({
        title: "Test Email Sent",
        description: data.message || "Test email has been sent successfully!",
        success: true,
      });
      queryClient.invalidateQueries({ queryKey: ["email-monitor"] });
    },
    onError: (error) => {
      toast({
        title: "Test Email Failed",
        description: error.message || "Failed to send test email",
        error: true,
      });
    },
  });

  return mutation;
};

/**
 * Hook for monitoring email statistics
 */
export const useEmailMonitor = (days: number = 7) => {
  const query = useQuery({
    queryKey: ["email-monitor", days],
    queryFn: async () => {
      const response = await client.api.email.monitor["$get"]({
        query: { days: String(days) },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch email statistics");
      }

      return await response.json() as MonitorResponseType;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });

  return query;
};

/**
 * Hook for email monitoring actions (retry, clear, pause, resume)
 */
export const useEmailMonitorAction = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<MonitorActionResponseType, Error, MonitorActionRequestType>({
    mutationFn: async (data) => {
      const response = await client.api.email.monitor.action["$post"]({
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to perform action");
      }

      return await response.json() as MonitorActionResponseType;
    },
    onSuccess: (data, variables) => {
      const actionMessages = {
        'retry-failed': 'Failed emails have been queued for retry',
        'clear-errors': 'Error logs have been cleared',
        'pause-queue': 'Email queue has been paused',
        'resume-queue': 'Email queue has been resumed',
      };

      toast({
        title: "Action Successful",
        description: data.message || actionMessages[variables.action],
        success: true,
      });

      // Invalidate monitor queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["email-monitor"] });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to perform the requested action",
        error: true,
      });
    },
  });

  return mutation;
};

/**
 * Hook for updating collaborator/innovator status with email notification
 */
export const useStatusUpdate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<StatusUpdateResponseType, Error, StatusUpdateRequestType>({
    mutationFn: async (data) => {
      const response = await client.api.email.status["$patch"]({
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      return await response.json() as StatusUpdateResponseType;
    },
    onSuccess: (data, variables) => {
      const statusMessage = variables.status === 'approved' 
        ? `${variables.type} has been approved` 
        : `${variables.type} has been rejected`;

      toast({
        title: "Status Updated",
        description: data.message || statusMessage,
        success: true,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["collaborator"] });
      queryClient.invalidateQueries({ queryKey: ["innovators"] });
      queryClient.invalidateQueries({ queryKey: ["email-monitor"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status",
        error: true,
      });
    },
  });

  return mutation;
};

/**
 * Hook for batch status updates
 */
export const useBatchStatusUpdate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, Array<StatusUpdateRequestType>>({
    mutationFn: async (items) => {
      const promises = items.map((item) =>
        client.api.email.status["$patch"]({
          json: item,
        })
      );

      const responses = await Promise.allSettled(promises);
      
      const failed = responses.filter(r => r.status === 'rejected').length;
      if (failed > 0) {
        throw new Error(`${failed} status updates failed`);
      }
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Batch Update Successful",
        description: `${variables.length} items have been updated`,
        success: true,
      });

      queryClient.invalidateQueries({ queryKey: ["collaborator"] });
      queryClient.invalidateQueries({ queryKey: ["innovators"] });
      queryClient.invalidateQueries({ queryKey: ["email-monitor"] });
    },
    onError: (error) => {
      toast({
        title: "Batch Update Failed",
        description: error.message || "Some updates failed to process",
        error: true,
      });
    },
  });

  return mutation;
};

/**
 * Custom hook for email health check
 */
export const useEmailHealthCheck = () => {
  const query = useQuery({
    queryKey: ["email-health"],
    queryFn: async () => {
      const response = await client.api.email.monitor["$get"]({
        query: { days: "1" },
      });

      if (!response.ok) {
        return { healthy: false, message: "Unable to check email health" };
      }

      const data = await response.json() as MonitorResponseType;
      const isHealthy = data.systemHealth?.status === 'healthy';
      
      return {
        healthy: isHealthy,
        message: isHealthy ? "Email system is operational" : "Email system has issues",
        details: data.systemHealth,
      };
    },
    refetchInterval: 60000, // Check every minute
    staleTime: 50000,
  });

  return query;
};
