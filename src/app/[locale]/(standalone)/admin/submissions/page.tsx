import { auth } from '@/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

export default async function SubmissionsPage({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const session = await auth();

    if (!session?.user) {
        redirect(`/${locale}/auth/login`);
    }

    const isArabic = locale === 'ar';

    // Fetch submissions
    const [innovators, collaborators] = await Promise.all([
        db.innovator.findMany({
            where: { status: 'PENDING' },
            include: {
                image: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        }),
        db.collaborator.findMany({
            where: { status: 'PENDING' },
            include: {
                image: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        }),
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isArabic ? 'مراجعة الطلبات' : 'Review Submissions'}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    {isArabic
                        ? 'راجع واعتمد أو ارفض طلبات المبتكرين والشركاء'
                        : 'Review and approve or reject innovator and collaborator submissions'}
                </p>
            </div>

            {/* Innovators Section */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {isArabic ? 'المبتكرون' : 'Innovators'}{' '}
                    <span className="text-sm text-gray-500">({innovators.length})</span>
                </h2>

                {innovators.length === 0 ? (
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
                        <p className="text-gray-500">
                            {isArabic ? 'لا توجد طلبات قيد المراجعة' : 'No pending submissions'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {innovators.map((innovator) => (
                            <div
                                key={innovator.id}
                                className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{innovator.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{innovator.email}</p>
                                        <p className="text-sm text-gray-600">{innovator.phone}</p>

                                        <div className="mt-4">
                                            <p className="font-semibold text-gray-900">{innovator.projectTitle}</p>
                                            {innovator.projectDescription && (
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {innovator.projectDescription}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {innovator.location && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {innovator.location}
                                                </span>
                                            )}
                                            {innovator.educationLevel && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {innovator.educationLevel}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {innovator.stageDevelopment}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 ml-4">
                                        <a
                                            href={`/${locale}/admin/submissions/innovators/${innovator.id}`}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                            {isArabic ? 'عرض' : 'View'}
                                        </a>
                                        <button
                                            disabled
                                            aria-disabled="true"
                                            title={isArabic ? 'قريباً' : 'Coming Soon'}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-300 rounded-md cursor-not-allowed"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            {isArabic ? 'قبول' : 'Approve'}
                                        </button>
                                        <button
                                            disabled
                                            aria-disabled="true"
                                            title={isArabic ? 'قريباً' : 'Coming Soon'}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-300 rounded-md cursor-not-allowed"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            {isArabic ? 'رفض' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {isArabic ? 'تم الإرسال في' : 'Submitted on'}{' '}
                                    {new Date(innovator.createdAt).toLocaleDateString(
                                        isArabic ? 'ar-EG' : 'en-US'
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Collaborators Section */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {isArabic ? 'الشركاء' : 'Collaborators'}{' '}
                    <span className="text-sm text-gray-500">({collaborators.length})</span>
                </h2>

                {collaborators.length === 0 ? (
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
                        <p className="text-gray-500">
                            {isArabic ? 'لا توجد طلبات قيد المراجعة' : 'No pending submissions'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {collaborators.map((collaborator) => (
                            <div
                                key={collaborator.id}
                                className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {collaborator.companyName}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">{collaborator.email}</p>
                                        <p className="text-sm text-gray-600">{collaborator.primaryPhoneNumber}</p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {collaborator.location && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {collaborator.location}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {collaborator.industrialSector}
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {collaborator.specialization}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 ml-4">
                                        <a
                                            href={`/${locale}/admin/submissions/collaborators/${collaborator.id}`}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                            {isArabic ? 'عرض' : 'View'}
                                        </a>
                                        <button
                                            disabled
                                            aria-disabled="true"
                                            title={isArabic ? 'قريباً' : 'Coming Soon'}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-300 rounded-md cursor-not-allowed"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            {isArabic ? 'قبول' : 'Approve'}
                                        </button>
                                        <button
                                            disabled
                                            aria-disabled="true"
                                            title={isArabic ? 'قريباً' : 'Coming Soon'}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-300 rounded-md cursor-not-allowed"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            {isArabic ? 'رفض' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {isArabic ? 'تم الإرسال في' : 'Submitted on'}{' '}
                                    {new Date(collaborator.createdAt).toLocaleDateString(
                                        isArabic ? 'ar-EG' : 'en-US'
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
