const crypto = require("crypto");
const { encryption } = require("../config/project-env");

const algorithm = 'aes-256-ctr';
const commonSecret = encryption.secret;

const encrypt = (data, userKey) => {
    const paswordHash = crypto.createHash("SHA256").update(userKey + commonSecret, "utf8").digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, paswordHash, iv);
    let crypted = cipher.update(data, "utf8", "hex");
    crypted += cipher.final("hex");
    return `${iv.toString('hex')}:${crypted.toString()}`;
};

const decrypt = (data, userKey) => {
    let [iv, encryptedText] = data.split(":");
    const paswordHash = crypto.createHash("SHA256").update(userKey + commonSecret, "utf8").digest();
    iv = Buffer.from(iv, "hex");
    const cipher = crypto.createDecipheriv(algorithm, paswordHash, iv);
    let crypted = cipher.update(encryptedText, "hex", "utf8");
    crypted += cipher.final("utf8");
    return crypted.toString();
};

module.exports = { encrypt, decrypt };

