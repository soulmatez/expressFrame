const NodeRSA = require("node-rsa")

/**
 * 加密公钥
 */
const _pubkey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzCDIxFPI6WS/83HdUadb
DEpkcVDfv2kX3LrgMB9Q7xMSft/TQbwQuMZmp4BOccYe32eWh06z6OBWJoBXUH1P
1pBgKz3JBEWud7ooh21YgBkuTuBJqPSH+eRQJ5t5b6aN7nOIi5CLmGhAhUNIpQp7
35NFDWd3pf8HZp2xmssWv4iA9ILYz4WATdqLM6cJgrX+hkXFaQ7JlYyvLZVriH9J
6uuODGn+zKTboxordQrgLwUKU8uuUYgbHpnM5pX88IyRYJVLteYm8MaWU8hEvDs/
jIDVnskDn08is8oZRlMVmRwlIJV/wo6xSRPswnn9PX6cZoTtx1Z5UkQjyK5G3p3f
0wIDAQAB
-----END PUBLIC KEY-----
`;

/**
 * 加密私钥
 */
const _prikey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMIMjEU8jpZL/z
cd1Rp1sMSmRxUN+/aRfcuuAwH1DvExJ+39NBvBC4xmangE5xxh7fZ5aHTrPo4FYm
gFdQfU/WkGArPckERa53uiiHbViAGS5O4Emo9If55FAnm3lvpo3uc4iLkIuYaECF
Q0ilCnvfk0UNZ3el/wdmnbGayxa/iID0gtjPhYBN2oszpwmCtf6GRcVpDsmVjK8t
lWuIf0nq644Maf7MpNujGit1CuAvBQpTy65RiBsemczmlfzwjJFglUu15ibwxpZT
yES8Oz+MgNWeyQOfTyKzyhlGUxWZHCUglX/CjrFJE+zCef09fpxmhO3HVnlSRCPI
rkbend/TAgMBAAECggEAfPY08bs462g5+hZinnINUuDXzGbuEoeLjBz60XraWQEb
+X+cHEm9EuCiRzhMzWmzzJ/ljr+nc5CiLL+0tBmCnp+Tv+T7AhqGS9UyqnVOEF1Z
8/9qGHxaIaibSSPsm2Uizi78EDRUwOBRX0NpXV+lpaDKTQJiRMRzC2bOKyzYqDcY
aBY5FDcLTjGc+IQEdyCoUVKN409bPF1SY+g7CgLPFPfxBO/3Vd3IdJFOrIl63Bm1
cyE5ZHQCe30G8tlqQit1+cgW8mTqhhvRT3sBnupbRKfXxMJDB/ZYZqbTG6zc1kG9
7+vkjUYWmAVGz2HAfc+UNhpQwyodjWgF8w1PkDWqgQKBgQDtEul69yVjvNNY1oX6
XzSEJWiRVPjwwKLMpy43ob/pfQpYvszy2nutUepPf5PggXJyKHukYBlHlLao4ymD
oEWlbk3Qx21i/odkE3N+PserbpE8NFhlJ4N2gcboIQn5NTpx9HUWjY9A+tBL2DAH
lWyPwP9uLCn/GfQYMuKrD2U0OQKBgQDcbI6wutGKb94IY8JIzTQyVq/7H7DIkzZ2
jZWCS4cdtl9bm7V4iVQ5YRox1Vr6VWKz21SnvmcS8Sh/cGgNH1ZwYSpT6ncmzgOg
2UqCBiEszez3uJRnee5HtAiki/DmDnAyKpVhvyow9/hkmWBEk+gTc1oQmGYa0QJh
rnsxcZFsawKBgGdJqxGY5eBbX1VAOaUIn6/HQJS5CbCSrRsu51LzlNJcWQqrLk3M
ZL/xhX1XXw0cOMmF28CU4c6u+xn/xpGDXXSi5yJEEONlc4VleBcTsRh+lqY9RBnm
Kj+ScR+nbVn3F9yYHf9Sc4xi+idhLCPRtTe4ZVERysZK/28flGPk1Dn5AoGAFrMD
OsXyYDxG9Dw5vL+NGYX913GbBfzLBghslh9rCa9HQKrXVFNoHgSW6vzawp7abEUx
AZlFChlVn1IXFQreHvKSplOl85QRoZXe62bwMan/Nj+G4OUYmb+7iB51L2vbN/9U
pN1H3gUbSljVJhrJMn+VjdHz6d0OTrrmKuBUJoMCgYBEi76a42XqTrmQ25kVyt+k
u7VBxp51pqHuE4kip6e8zqTC4euVG6LE5xTZoeRqJJ9b1pisMsBgY4PYcq09YUb3
7Ye8LQei0ddTX7mV8ZScN4K2drt2xmVHYvUeJXGiFEfn/GscmnznQeNEG002zDTa
0i5gZe/mdeUBNKfr7+awRg==
-----END PRIVATE KEY-----
`;


/**
 * 
 * @param {*} privateKey 
 * @param {*} string 
 * 解密
 */
function decrypt(privateKey, string) {
    const priKey = new NodeRSA(privateKey) // 使用node-rsa
    priKey.setOptions({ encryptionScheme: "pkcs1" }) // 因为vue中使用jsencrypt，jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1
    return priKey.decrypt(string, "utf8");
}   

exports.default =  { _pubkey, _prikey, decrypt }