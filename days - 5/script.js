const generateButton = document.querySelector(".get_pass");
const passwordList = document.querySelector(".result ul");
const resultStatus = document.querySelector(".result-status");

const characterGroups = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789"
];
const passwordLength = 12;

function getRandomCharacter(characters) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
}

function generatePassword() {
    const allCharacters = characterGroups.join("");
    const passwordCharacters = characterGroups.map(getRandomCharacter);

    for (let index = passwordCharacters.length; index < passwordLength; index++) {
        passwordCharacters.push(getRandomCharacter(allCharacters));
    }

    for (let index = passwordCharacters.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [passwordCharacters[index], passwordCharacters[randomIndex]] =
            [passwordCharacters[randomIndex], passwordCharacters[index]];
    }

    return passwordCharacters.join("");
}

function showPassword(password) {
    const listItem = document.createElement("li");
    const passwordText = document.createElement("span");
    const copyButton = document.createElement("button");

    passwordText.className = "password-text";
    passwordText.textContent = password;

    copyButton.className = "copy-password";
    copyButton.type = "button";
    copyButton.dataset.copy = "true";
    copyButton.textContent = "Salin";
    copyButton.setAttribute("aria-label", "Salin password");

    listItem.append(passwordText, copyButton);
    passwordList.replaceChildren(listItem);
    resultStatus.textContent = "";
}

generateButton.addEventListener("click", () => {
    showPassword(generatePassword());
});

passwordList.addEventListener("click", async (event) => {
    const copyButton = event.target.closest("button[data-copy]");

    if (!copyButton) {
        return;
    }

    const passwordText = passwordList.querySelector(".password-text").textContent;

    if (!navigator.clipboard || !window.isSecureContext) {
        resultStatus.textContent =
            "Clipboard tidak tersedia di halaman ini. Salin password secara manual.";
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordText);
        copyButton.textContent = "Tersalin!";
        resultStatus.textContent = "Password berhasil disalin.";
    } catch (error) {
        resultStatus.textContent =
            "Password gagal disalin. Silakan pilih dan salin password secara manual.";
        console.error("Gagal menyalin password ke clipboard:", error);
    }
});