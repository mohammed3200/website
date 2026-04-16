const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../testsprite_tests/registration');

function fixTypo(file) {
    const fullPath = path.join(dir, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('raise AssertionError(f")')) {
        content = content.replace(/raise AssertionError\(f"\)/g, 'raise AssertionError(f"');
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed typo in ${file}`);
    }
}

['TC001_collaborator_public_list.py',
 'TC002_collaborator_registration_happy_path.py',
 'TC008_innovator_public_list.py',
 'TC009_innovator_registration_happy_path.py'
].forEach(fixTypo);
