const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../testsprite_tests/registration');

function fixRunAtImport(filename) {
    const filePath = path.join(dir, filename);
    if (!fs.existsSync(filePath)) {
        console.debug(`Skipping missing file: ${filename}`);
        return;
    }
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.match(/^run\(\)\s*$/m)) {
            content = content.replace(/^run\(\)\s*$/m, 'if __name__ == "__main__":\n    run()\n');
            fs.writeFileSync(filePath, content);
        }
    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

['TC006_collaborator_registration_invalid_email.py',
 'TC007_collaborator_registration_invalid_phone.py',
 'TC009_innovator_registration_happy_path.py',
 'TC014_innovator_registration_project_description_too_long.py'
].forEach(fixRunAtImport);

function fixExceptions(files) {
    for (const file of files) {
        if (!fs.existsSync(path.join(dir, file))) continue;
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        content = content.replace(/assert False,\s*((?:[fruFRU]{0,3})?(?:'([^'\\]|\\.)*'|"([^"\\]|\\.)*"))/g, 'raise AssertionError($1)');
        
        // TC008 specifics
        if (file === 'TC008_innovator_public_list.py') {
            content = content.replace(/except Exception as e:/g, 'except ValueError as e:');
        }
        
        fs.writeFileSync(path.join(dir, file), content);
    }
}
fixExceptions([
    'TC001_collaborator_public_list.py',
    'TC002_collaborator_registration_happy_path.py',
    'TC008_innovator_public_list.py',
    'TC009_innovator_registration_happy_path.py'
]);

// TC002 phone number hex
function fixPhone(file) {
    if (!fs.existsSync(path.join(dir, file))) return;
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    // We add a random numeric generator or use uuid.int
    if (!content.includes('unique_phone')) {
        content = content.replace(/unique = uuid.uuid4\(\).hex/, 'unique = uuid.uuid4().hex\n    unique_phone = str(uuid.uuid4().int)[:10]');
        // replace f"+21891{unique[:6]}" with f"+21891{unique_phone[:6]}"
        content = content.replace(/\{unique\[:6\]\}/g, '{unique_phone[:6]}');
        fs.writeFileSync(path.join(dir, file), content);
    }
}
['TC002_collaborator_registration_happy_path.py',
 'TC003_collaborator_registration_duplicate_email.py',
 'TC004_collaborator_registration_duplicate_phone.py',
 'TC013_innovator_registration_max_length_violations.py'
].forEach(fixPhone);

console.log("Auto-fixes complete.");
