const fs = require('fs');
const path = require('path');

const roles = ['national', 'state', 'district', 'taluka', 'village'];
const baseDir = path.join(__dirname, 'src', 'app', '[locale]', 'admin');

const pageContent = `import DashboardPage from "../dashboard/page";
export default DashboardPage;
`;

roles.forEach(role => {
  const dirPath = path.join(baseDir, role);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), pageContent);
  console.log('Created route:', dirPath);
});
