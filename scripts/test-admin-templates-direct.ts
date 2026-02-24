// scripts/test-admin-templates-direct.ts
// bun tsx scripts/test-admin-templates-direct.ts
// Test admin notification email templates by sending directly, bypassing database
import { render } from '@react-email/render';
import AdminNotification from '@/lib/email/templates/AdminNotification';
import { emailService } from '@/lib/email/service';
import { NotificationPriority } from '@prisma/client';

async function testAdminNotificationTemplates() {
  console.log('🧪 Testing Admin Notification Email Templates...\n');

  const testEmail = process.env.TEST_EMAIL || 'wwyuu799@gmail.com';
  const adminName = 'Administrator';

  console.log(`📧 Sending test emails to: ${testEmail}\n`);

  try {
    // Test 1: New Collaborator Registration (HIGH Priority)
    console.log('1️⃣ Testing New Collaborator Registration Notification...');
    const html1 = await render(
      AdminNotification({
        adminName,
        title: 'New Collaborator Registration / تسجيل شريك جديد',
        message:
          'A new collaborator "شركة التقنية المتقدمة (Advanced Tech Co.)" from Technology sector has registered.\n\n' +
          'تم تسجيل شريك جديد من قطاع التكنولوجيا.',
        actionUrl: 'http://localhost:3000/admin/collaborators?id=CLB-TEST-001',
        actionText: 'View Details / عرض التفاصيل',
        priority: 'HIGH',
        locale: 'en',
        timestamp: new Date(),
      }),
    );
    const result1 = await emailService.sendEmail({
      to: testEmail,
      subject: '[EBIC Admin] New Collaborator Registration',
      html: html1,
    });
    console.log(
      result1.success ? '   ✅ Sent' : '   ❌ Failed:',
      result1.error || result1.messageId,
    );
    console.log('');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 2: New Innovator Project Submission (HIGH Priority)
    console.log('2️⃣ Testing New Innovator Project Submission Notification...');
    const html2 = await render(
      AdminNotification({
        adminName,
        title: 'New Innovator Project Submission / مشروع مبتكر جديد',
        message:
          'محمد أحمد (Mohammed Ahmed) has submitted a new project: "تطبيق ذكي للتعليم الإلكتروني (Smart E-Learning App)".\n\n' +
          'يرجى مراجعة المشروع والرد في أقرب وقت ممكن.',
        actionUrl: 'http://localhost:3000/admin/innovators?id=INV-TEST-001',
        actionText: 'Review Project / مراجعة المشروع',
        priority: 'HIGH',
        locale: 'en',
        timestamp: new Date(),
      }),
    );
    const result2 = await emailService.sendEmail({
      to: testEmail,
      subject: '[EBIC Admin] New Innovator Project Submission',
      html: html2,
    });
    console.log(
      result2.success ? '   ✅ Sent' : '   ❌ Failed:',
      result2.error || result2.messageId,
    );
    console.log('');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 3: System Error Alert (URGENT Priority)
    console.log('3️⃣ Testing System Error Alert (URGENT Priority)...');
    const html3 = await render(
      AdminNotification({
        adminName,
        title: '⚠️ System Error Detected / خطأ في النظام',
        message:
          'An error occurred: Database connection timeout after 30 seconds\n\n' +
          'Context: collaborator-registration-service\n' +
          'Error at /api/collaborators/register:145\n\n' +
          'حدث خطأ في الاتصال بقاعدة البيانات. يرجى التحقق من النظام على الفور.',
        actionUrl: 'http://localhost:3000/admin/system/logs',
        actionText: 'View Logs / عرض السجلات',
        priority: 'URGENT',
        locale: 'en',
        timestamp: new Date(),
      }),
    );
    const result3 = await emailService.sendEmail({
      to: testEmail,
      subject: '[EBIC Admin - URGENT] ⚠️ System Error Detected',
      html: html3,
    });
    console.log(
      result3.success ? '   ✅ Sent' : '   ❌ Failed:',
      result3.error || result3.messageId,
    );
    console.log('');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 4: Security Alert (URGENT Priority)
    console.log('4️⃣ Testing Security Alert (URGENT Priority)...');
    const html4 = await render(
      AdminNotification({
        adminName,
        title: '🔒 Security Alert / تنبيه أمني',
        message:
          'Suspicious activity detected: Multiple admin login attempts from unknown IP\n\n' +
          'User ID: user-12345\n' +
          'IP Address: 192.168.1.100\n\n' +
          'تم اكتشاف نشاط مشبوه. يرجى اتخاذ الإجراءات الأمنية المناسبة.',
        actionUrl: 'http://localhost:3000/admin/security/alerts',
        actionText: 'Investigate / التحقيق',
        priority: 'URGENT',
        locale: 'en',
        timestamp: new Date(),
      }),
    );
    const result4 = await emailService.sendEmail({
      to: testEmail,
      subject: '[EBIC Admin - URGENT] 🔒 Security Alert',
      html: html4,
    });
    console.log(
      result4.success ? '   ✅ Sent' : '   ❌ Failed:',
      result4.error || result4.messageId,
    );
    console.log('');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 5: Failed Login Attempts (HIGH Priority)
    console.log('5️⃣ Testing Failed Login Attempts Alert (HIGH Priority)...');
    const html5 = await render(
      AdminNotification({
        adminName,
        title: '🚨 Multiple Failed Login Attempts / محاولات دخول فاشلة متعددة',
        message:
          '5 failed login attempts detected for ebic@cit.edu.ly\n\n' +
          'IP Address: 192.168.1.50\n' +
          'Time: Within the last 15 minutes\n\n' +
          'تم اكتشاف 5 محاولات دخول فاشلة. قد يكون هذا هجومًا.',
        actionUrl: 'http://localhost:3000/admin/security/logins',
        actionText: 'Review Login Attempts / مراجعة المحاولات',
        priority: 'HIGH',
        locale: 'en',
        timestamp: new Date(),
      }),
    );
    const result5 = await emailService.sendEmail({
      to: testEmail,
      subject: '[EBIC Admin] 🚨 Multiple Failed Login Attempts',
      html: html5,
    });
    console.log(
      result5.success ? '   ✅ Sent' : '   ❌ Failed:',
      result5.error || result5.messageId,
    );
    console.log('');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 6: User Account Created (NORMAL Priority)
    console.log(
      '6️⃣ Testing User Account Created Notification (NORMAL Priority)...',
    );
    const html6 = await render(
      AdminNotification({
        adminName,
        title: 'New User Account Created / تم إنشاء حساب مستخدم جديد',
        message:
          'A new admin user "Sarah Ahmed" has been created with role: Supervisor.\n\n' +
          'Email: sarah.ahmed@cit.edu.ly\n' +
          'Role: Supervisor\n' +
          'Permissions: Collaborators, Innovators\n\n' +
          'تم إنشاء مستخدم جديد "سارة أحمد" بدور: مشرف.',
        actionUrl: 'http://localhost:3000/admin/users',
        actionText: 'Manage Users / إدارة المستخدمين',
        priority: 'NORMAL',
        locale: 'en',
        timestamp: new Date(),
      }),
    );
    const result6 = await emailService.sendEmail({
      to: testEmail,
      subject: '[EBIC Admin] New User Account Created',
      html: html6,
    });
    console.log(
      result6.success ? '   ✅ Sent' : '   ❌ Failed:',
      result6.error || result6.messageId,
    );
    console.log('');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 7: Database Backup Complete (LOW Priority)
    console.log(
      '7️⃣ Testing Database Backup Complete Notification (LOW Priority)...',
    );
    const html7 = await render(
      AdminNotification({
        adminName,
        title:
          'Database Backup Completed Successfully / اكتملت نسخة احتياطية لقاعدة البيانات',
        message:
          'Automated database backup completed successfully at 3:00 AM.\n\n' +
          'Backup Details:\n' +
          '• Size: 2.4 GB\n' +
          '• Duration: 12 minutes\n' +
          '• Status: Success\n' +
          '• Location: /backups/db-backup-2025-01-11.sql.gz\n\n' +
          'اكتملت النسخة الاحتياطية التلقائية لقاعدة البيانات بنجاح في الساعة 3:00 صباحًا.',
        actionUrl: 'http://localhost:3000/admin/system/backups',
        actionText: 'View Backups / عرض النسخ الاحتياطية',
        priority: 'LOW',
        locale: 'en',
        timestamp: new Date(),
      }),
    );
    const result7 = await emailService.sendEmail({
      to: testEmail,
      subject: '[EBIC Admin] Database Backup Completed Successfully',
      html: html7,
    });
    console.log(
      result7.success ? '   ✅ Sent' : '   ❌ Failed:',
      result7.error || result7.messageId,
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
      console.log(
        '\n🎉 All admin notification templates are working correctly!',
      );
      console.log(`\n✉️  Check ${testEmail} inbox for test emails.`);
      console.log('\nYou should see 7 emails with different priority levels:');
      console.log('   🔴 URGENT: System Error, Security Alert');
      console.log('   🟠 HIGH: New Collaborator, New Innovator, Failed Logins');
      console.log('   🔵 NORMAL: User Account Created');
      console.log('   🟢 LOW: Database Backup');
    } else {
      console.log('\n⚠️ Some tests failed. Check the logs above for details.');
    }
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests
testAdminNotificationTemplates()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
