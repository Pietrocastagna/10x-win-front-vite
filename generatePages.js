// generatePages.js
const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, "src", "pages");

// Lista dei nomi (esclusi SupportScreen e SupportMessagesScreen)
const pageNames = [
  "EmailScreen",
  "PasswordScreen",
  "VerifyPhoneScreen",
  "KycScreen",
  "PaymentsScreen",
  "AddCardScreen",
  "TwoFactorScreen",
  "SessionsScreen",
  "DevicesScreen",
  "ParticipatedEventsScreen",
  "WonMedalsScreen",
  "CoinHistoryScreen",
  "LanguageScreen",
  "ThemeScreen",
  "NotificationsScreen",
  "FaqScreen",
  "LogoutScreen",
];

// Crea la directory se non esiste
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

pageNames.forEach((name) => {
  const filePath = path.join(pagesDir, `${name}.tsx`);
  if (!fs.existsSync(filePath)) {
    const content = `const ${name} = () => {
  return <div>${name}</div>;
};

export default ${name};
`;
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${name}.tsx`);
  } else {
    console.log(`⚠️ Already exists: ${name}.tsx`);
  }
});
