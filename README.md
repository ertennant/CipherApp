# Cipher App 

## Description 

This project provides tools for applying several historically interesting ciphers to text. 

***DO NOT USE THESE TOOLS FOR SENSITIVE DATA.*** The ciphers implemented here are not secure against attacks using modern techniques. This app is intended to be used for education and entertainment. 

## How to Use 

### Step-by-Step Instructions 

This project is currently hosted through GitHub Pages. Open []() in your browser to start. 
1. Select `Encrypt` if you wish to encrypt your text, `Decrypt` if you wish to decrypt it. 
2. Input your text and click `Done`. 
3. The `Cipher Settings` panel allows you to set the parameters of your cipher. 
    1. Select the alphabet your plaintext uses. 
    2. Select the cipher you wish to apply. 
    3. Be sure to set any necessary parameters for your cipher: e.g., the Shift Cipher requires a shift value, the Vigenère Cipher requires a keyword, and so on. 
4. Click `Apply Changes` to see the result generated with these settings. 

### Cipher Settings Explained 

**Shift Value**: for **Caesar/Shift Cipher**. In `Encrypt` mode, every character will be shifted *forwards* by this amount, e.g. if shift value = 2, 'A' becomes 'C'. Wrap-around occurs when the end of the alphabet is reached, e.g. 'Z' with a shift value of 4 becomes 'D'. In `Decrypt` mode, the operation is reversed. 

**Atbash Cipher**: this cipher simply reverses the order of the alphabet. For example, 'A' becomes 'Z', 'B' becomes 'Y', and so on. 

**Keyword - Monoalphabetic Substitution Cipher**: the first letter of `Keyword` is what 'A' will become when encrypted, the second letter (that hasn't already been used in `Keyword`) is what 'B' will become, and so on. If `Keyword` is shorter than the alphabet, the remaining letters of the alphabet that do not occur in `Keyword` are added to the end of `Keyword` in order before the cipher is applied. 

**Keyword - Vigenère Cipher**: the letters of `Keyword` specify different shift distances for each letter in the text (basically, it applies the `Shift Cipher` with a variable `Shift Value`). For example, if the first letter of `Keyword` is 'C' and the first letter of the text is 'M', the 'M' is shifted forward by 2 and becomes 'O'. If the current `Keyword` letter is 'A', the Shift Value is 0, so no change occurs. If `Keyword` is shorter than the alphabet, `Keyword` will be repeated from the beginning as needed. 

**Remove Whitespace**: removes all whitespace characters from your text *before* applying the cipher. 

**Remove Non-Letter Characters**: removes punctuation and symbols before applying the cipher. 

**Preserve Case**: treats lowercase and uppercase letters separately. 

**Use Groups**: breaks the text into equal-sized sections separated by spaces. The length of these sections is set using the `Group Size` setting. 

**Group Size**: sets the length of blocks the text is split into if `Use Groups` is turned on. 

**Pad End**: if `Use Groups` is turned on, `Pad End` adds copies of `Null Character` to the end of the original text to make it divisible by `Group Size`. 

**Null Character**: sets the character that is added at the end of the text if `Pad End` is turned on. 

