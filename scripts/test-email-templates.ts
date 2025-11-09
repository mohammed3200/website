// scripts/test-email-templates.ts
import { emailService } from '@/lib/email/service';

async function testEmailTemplates() {
  console.log('🧪 Testing Email Templates...\n');

  // Test data
  const testEmail = process.env.TEST_EMAIL || 'wwyuu799@gmail.com';
  const testData = {
    collaborator: {
      id: 'CLB-TEST-001',
      companyName: 'شركة التقنية المتقدمة',
      name: 'Ahmed Technologies',
      email: testEmail,
    },
    innovator: {
      id: 'INV-TEST-001',
      name: 'محمد أحمد',
      email: testEmail,
    },
  };

  try {
    // Test 1: Submission Confirmation (Arabic)
    console.log(
      '1️⃣ Testing Submission Confirmation (Arabic - Collaborator)...',
    );
    const result1 = await emailService.sendSubmissionConfirmation(
      'collaborator',
      testData.collaborator,
      'ar',
    );
    console.log(
      result1.success ? '✅ Success' : '❌ Failed:',
      result1.error || result1.messageId,
    );
    console.log('');

    // Test 2: Submission Confirmation (English)
    console.log('2️⃣ Testing Submission Confirmation (English - Innovator)...');
    const result2 = await emailService.sendSubmissionConfirmation(
      'innovator',
      testData.innovator,
      'en',
    );
    console.log(
      result2.success ? '✅ Success' : '❌ Failed:',
      result2.error || result2.messageId,
    );
    console.log('');

    // Test 3: Status Update - Approval (Arabic)
    console.log('3️⃣ Testing Status Update - Approval (Arabic)...');
    const result3 = await emailService.sendStatusUpdate(
      'collaborator',
      testData.collaborator,
      'approved',
      {
        locale: 'ar',
        nextSteps: [
          'قم بزيارة المركز لإكمال الإجراءات',
          'أحضر المستندات المطلوبة',
          'حدد موعدًا مع المنسق',
        ],
      },
    );
    console.log(
      result3.success ? '✅ Success' : '❌ Failed:',
      result3.error || result3.messageId,
    );
    console.log('');

    // Test 4: Status Update - Rejection (English)
    console.log('4️⃣ Testing Status Update - Rejection (English)...');
    const result4 = await emailService.sendStatusUpdate(
      'innovator',
      testData.innovator,
      'rejected',
      {
        locale: 'en',
        reason:
          'The project needs further development and more detailed documentation.',
        nextSteps: [
          'Review the feedback provided',
          'Enhance project documentation',
          'Reapply after improvements',
        ],
      },
    );
    console.log(
      result4.success ? '✅ Success' : '❌ Failed:',
      result4.error || result4.messageId,
    );
    console.log('');

    // Test 5: Password Reset (Arabic)
    console.log('5️⃣ Testing Password Reset (Arabic)...');
    const result5 = await emailService.sendPasswordReset(
      {
        name: 'محمد أحمد',
        email: testEmail,
        resetLink: 'https://ebic.cit.edu.ly/reset-password?token=test123',
      },
      'ar',
    );
    console.log(
      result5.success ? '✅ Success' : '❌ Failed:',
      result5.error || result5.messageId,
    );
    console.log('');

    // Test 6: Welcome Email (English)
    console.log('6️⃣ Testing Welcome Email (English)...');
    const result6 = await emailService.sendWelcome(
      {
        name: 'Ahmed Hassan',
        email: testEmail,
        role: 'Administrator',
        loginLink: 'https://ebic.cit.edu.ly/admin/login',
      },
      'en',
    );
    console.log(
      result6.success ? '✅ Success' : '❌ Failed:',
      result6.error || result6.messageId,
    );
    console.log('');

    // Test 7: 2FA Code (Arabic)
    console.log('7️⃣ Testing 2FA Code (Arabic)...');
    const result7 = await emailService.send2FA(
      {
        name: 'محمد أحمد',
        email: testEmail,
        code: '123456',
      },
      'ar',
    );
    console.log(
      result7.success ? '✅ Success' : '❌ Failed:',
      result7.error || result7.messageId,
    );
    console.log('');

    // Test 8: Connection Test
    console.log('8️⃣ Testing SMTP Connection...');
    const connectionTest = await emailService.testConnection();
    console.log(
      connectionTest.success
        ? `✅ Connected (${connectionTest.provider})`
        : `❌ Failed: ${connectionTest.error}`,
    );
    console.log('');

    // Summary
    const results = [
      result1,
      result2,
      result3,
      result4,
      result5,
      result6,
      result7,
    ];
    const successCount = results.filter((r) => r.success).length;
    const totalTests = results.length;

    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${successCount}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - successCount}/${totalTests}`);

    if (successCount === totalTests) {
      console.log('\n🎉 All email templates are working correctly!');
    } else {
      console.log('\n⚠️ Some tests failed. Check the logs above for details.');
    }
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests
testEmailTemplates()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
