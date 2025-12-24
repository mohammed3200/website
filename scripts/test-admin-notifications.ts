// scripts/test-admin-notifications.ts
// bun tsx scripts/test-admin-notifications.ts
import {
  notifyAdmins,
  notifyNewCollaborator,
  notifyNewInnovator,
  notifySystemError,
  notifySecurityAlert,
  notifyFailedLoginAttempts,
} from '@/lib/notifications/admin-notifications';
import { NotificationPriority } from '@prisma/client';

async function testAdminNotifications() {
  console.log('🧪 Testing Admin Notification Templates...\n');

  const testEmail = process.env.TEST_EMAIL || 'wwyuu799@gmail.com';
  console.log(`📧 Sending test notifications to: ${testEmail}\n`);

  try {
    // Test 1: New Collaborator Registration
    console.log('1️⃣ Testing New Collaborator Registration Notification...');
    const result1 = await notifyNewCollaborator({
      id: 'CLB-TEST-001',
      companyName: 'شركة التقنية المتقدمة (Advanced Tech Co.)',
      email: testEmail,
      sector: 'Technology / التكنولوجيا',
    });
    console.log(`   ✅ Sent: ${result1.sent}, ❌ Failed: ${result1.failed}`);
    console.log('');

    // Wait 2 seconds between emails
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 2: New Innovator Project Submission
    console.log('2️⃣ Testing New Innovator Project Submission Notification...');
    const result2 = await notifyNewInnovator({
      id: 'INV-TEST-001',
      name: 'محمد أحمد (Mohammed Ahmed)',
      projectTitle: 'تطبيق ذكي للتعليم الإلكتروني (Smart E-Learning App)',
      email: testEmail,
    });
    console.log(`   ✅ Sent: ${result2.sent}, ❌ Failed: ${result2.failed}`);
    console.log('');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 3: System Error Alert (URGENT)
    console.log('3️⃣ Testing System Error Alert (URGENT Priority)...');
    const result3 = await notifySystemError({
      error: 'Database connection timeout after 30 seconds',
      context: 'collaborator-registration-service',
      stackTrace: 'Error at /api/collaborators/register:145',
    });
    console.log(`   ✅ Sent: ${result3.sent}, ❌ Failed: ${result3.failed}`);
    console.log('');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 4: Security Alert (URGENT)
    console.log('4️⃣ Testing Security Alert (URGENT Priority)...');
    const result4 = await notifySecurityAlert({
      alert: 'Suspicious activity detected: Multiple admin login attempts from unknown IP',
      userId: 'user-12345',
      ipAddress: '192.168.1.100',
    });
    console.log(`   ✅ Sent: ${result4.sent}, ❌ Failed: ${result4.failed}`);
    console.log('');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 5: Failed Login Attempts (HIGH)
    console.log('5️⃣ Testing Failed Login Attempts Alert (HIGH Priority)...');
    const result5 = await notifyFailedLoginAttempts({
      email: 'admin@example.com',
      attempts: 5,
      ipAddress: '192.168.1.50',
    });
    console.log(`   ✅ Sent: ${result5.sent}, ❌ Failed: ${result5.failed}`);
    console.log('');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 6: Custom Notification (NORMAL)
    console.log('6️⃣ Testing Custom Admin Notification (NORMAL Priority)...');
    const result6 = await notifyAdmins({
      type: 'USER_ACCOUNT_CREATED',
      title: 'New User Account Created / تم إنشاء حساب مستخدم جديد',
      message:
        'A new admin user "Sarah Ahmed" has been created with role: Supervisor.\n' +
        'تم إنشاء مستخدم جديد "سارة أحمد" بدور: مشرف.',
      actionUrl: 'http://localhost:3000/admin/users',
      priority: NotificationPriority.NORMAL,
    });
    console.log(`   ✅ Sent: ${result6.sent}, ❌ Failed: ${result6.failed}`);
    console.log('');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 7: Database Backup Complete (LOW)
    console.log('7️⃣ Testing Database Backup Notification (LOW Priority)...');
    const result7 = await notifyAdmins({
      type: 'DATABASE_BACKUP_COMPLETE',
      title: 'Database Backup Completed Successfully / اكتملت نسخة احتياطية لقاعدة البيانات',
      message:
        'Automated database backup completed successfully at 3:00 AM.\n' +
        'Size: 2.4 GB | Duration: 12 minutes\n\n' +
        'اكتملت النسخة الاحتياطية التلقائية لقاعدة البيانات بنجاح في الساعة 3:00 صباحًا.',
      actionUrl: 'http://localhost:3000/admin/system/backups',
      priority: NotificationPriority.LOW,
    });
    console.log(`   ✅ Sent: ${result7.sent}, ❌ Failed: ${result7.failed}`);
    console.log('');

    // Summary
    const results = [result1, result2, result3, result4, result5, result6, result7];
    const totalSent = results.reduce((sum, r) => sum + r.sent, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
    const totalTests = results.length;

    console.log('\n📊 Test Summary:');
    console.log(`📧 Total Notifications Sent: ${totalSent}`);
    console.log(`❌ Total Failed: ${totalFailed}`);
    console.log(`🧪 Total Test Cases: ${totalTests}`);

    if (totalFailed === 0) {
      console.log('\n🎉 All admin notification templates are working correctly!');
      console.log(`\n✉️  Check ${testEmail} inbox for test emails.`);
    } else {
      console.log('\n⚠️ Some notifications failed. Check the logs above for details.');
    }
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests
testAdminNotifications()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
