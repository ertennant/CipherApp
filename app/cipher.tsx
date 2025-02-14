/** Module providing cipher functions. 
 * Path: /cipher-app/app/cipher.tsx
 */

type CipherOptions = {
  preserveCase: boolean, 
  removeWhitespace: boolean, 
  removeNonAlpha: boolean, 
  useGroups: boolean, 
  groupSize: number, 
  usePadding: boolean, 
  nullCharacter?: string, // if unspecified, defaults to last char in alphabet 
}

/**
 * Create mapping of input chars to output chars for the Caesar Cipher. 
 * @param {string[]} alphabet - The alphabet used for the input and output texts. 
 * @param {number} shiftVal - The amount each char should be shifted by. Must be non-negative. 
 * @param {boolean} preserveCase - If true, the case of each output char matches the case of its corresponding input char. 
 * @param {string} mode - Encrypt or Decrypt. 
 * @returns {Map<string, string>} A Map<string, string> where the keys are input chars and the values are the corresponding output chars. 
 */
function mapCaesar(alphabet: string[], shiftVal: number, preserveCase: boolean, mode: string): Map<string, string> {
  if (mode === "decrypt") {
    shiftVal *= -1; 
  }
  let map = new Map(); 
  for (let i = 0; i < alphabet.length; i++) {
    let j = i + shiftVal; 
    if (j < 0) {
      j += alphabet.length; 
    } else if (j >= alphabet.length) {
      j -= alphabet.length; 
    }
    map.set(alphabet[i], alphabet[j]);
    if (preserveCase === true) {
      map.set(alphabet[i].toLowerCase(), alphabet[j].toLowerCase());
    }
  } 
  return map; 
}

/**
 * Create mapping of input chars to output chars for the Atbash cipher. 
 * @param {string[]} alphabet - The alphabet used for the input and output texts. 
 * @param {boolean} preserveCase - If true, the case of each output char matches the case of its corresponding input char. 
 * @returns {Map<string, string>} A Map where the keys are input chars and the values are the corresponding output chars. 
 */
function mapAtbash(alphabet: string[], preserveCase: boolean): Map<string, string> {
  let map = new Map(); 
  for (let i = 0; i < alphabet.length; i++) {
    map.set(alphabet[i], alphabet[alphabet.length - i - 1]);
    if (preserveCase === true) {
      map.set(alphabet[i].toLowerCase(), alphabet[alphabet.length - i - 1].toLowerCase());
    }
  }
  return map; 
}

/**
 * Create mapping of input chars to output chars for the Monoalphabetic Substitution Cipher. 
 * @param {string[]} alphabet - The alphabet used for the input and output texts. 
 * @param {string} keyword - The keyword used for mapping. 
 * @param {boolean} preserveCase - If true, the case of each output char matches the case of its corresponding input char. 
 * @param {string} mode - Encrypt or Decrypt. 
 * @returns {Map<string, string>} A Map where the keys are input chars and the values are the corresponding output chars. 
 */
function mapMonoSubstitution(alphabet: string[], keyword: string, preserveCase: boolean, mode: string): Map<string, string> {
  let map = new Map(); 
  keyword = keyword.toUpperCase(); 
  let i = 0; 
  for (i = 0; i < keyword.length; i++) {
    let a = alphabet[i];
    let b = keyword.charAt(i); 

    // set letter mappings 
    if (mode === "encrypt") {
      map.set(a, b);
      if (preserveCase === true) {
        map.set(a.toLowerCase(), b.toLowerCase());
      }
    } else if (mode === "decrypt") {
      map.set(b, a);
      if (preserveCase === true) {
        map.set(b.toLowerCase(), a.toLowerCase());
      }
    }
  }
  
  // deal with any part of the alphabet remaining (i.e., if keyword.length < alphabet.length)
  for (i = i; i < alphabet.length; i++) {
    let a = alphabet[i];
    map.set(a, a);
    if (preserveCase === true) {
      map.set(a.toLowerCase(), a.toLowerCase());
    }
  }
  return map; 
}

/**
 * Uses a Map<string, string> of input chars to corresponding output chars to convert the input text into the output text. 
 * @param {string[]} alphabet - The alphabet used for the input and output texts. 
 * @param {string} inputText - The text to encrypt or decrypt. 
 * @param {Map<string, string>} mapping - The mapping of input chars to output chars for the cipher in use. 
 * @param {CipherOptions} options - Options to apply, e.g. whether to keep whitespace where it is, remove non-alphabetic characters, or break text into equal-sized groups. 
 * @returns {string} The resulting text after encryption or decryption. 
 */
function processMonoCipherText(alphabet: string[], inputText: string, mapping: Map<string, string>, options: CipherOptions): string {
  let g = 0; // group index counter
  let outputText = "";
  for (let i = 0; i < inputText.length; i++) {
    // if useGroups is on, insert a space if one is needed 
    if (options.useGroups === true && g === options.groupSize) {
      console.log("X");
      outputText += ' ';
      g = 0; 
    } 

    let inChar = inputText.charAt(i);
    if (alphabet.includes(inChar.toUpperCase())) {
      if (inChar !== inChar.toUpperCase() && options.preserveCase === false) {
        outputText += mapping.get(inChar.toUpperCase());
      } else {
        outputText += mapping.get(inChar);
      }
      g++; 
    } else if (inChar !== ' ' && !alphabet.includes(inChar) && options.removeNonAlpha === false) {
      outputText += inChar; 
      g++; 
    } else if (inChar === ' ' && options.removeWhitespace === false && options.useGroups === false) {
      outputText += inChar;
      g++; 
    }
  }
  // pad the final block if needed 
  if (options.useGroups && options.usePadding && g > 0) {
    if (!options.nullCharacter || !alphabet.includes(options.nullCharacter)) {
      options.nullCharacter = alphabet[alphabet.length - 1];
    }
    while (g < options.groupSize) {
      outputText += mapping.get(options.nullCharacter);
      g++; 
    }
  }
  return outputText; 
}

/**
 * Applies the Vigenere Cipher to the provided inputText using the specified keyword, mode, and options. 
 * @param {string[]} alphabet - The alphabet used for the input and output texts. 
 * @param {string} inputText - The text to encrypt or decrypt. 
 * @param {string} keyword - The keyword used for mapping. 
 * @param {string} mode - Encrypt or Decrypt. 
 * @param {CipherOptions} options - Options to apply, e.g. whether to keep whitespace where it is, remove non-alphabetic characters, or break text into equal-sized groups. 
 * @returns {string} The resulting text after encryption or decryption. 
 */
function applyVigenere(alphabet: string[], inputText: string, keyword: string, mode: string, options: CipherOptions): string {
  if (!keyword) {
    return inputText; 
  }
  keyword = keyword.toUpperCase(); 
  
  let outputText = "";
  let g = 0; // group index counter 
  let k = 0; // keyword index 

  for (let i = 0; i < inputText.length; i++) {
    if (options.useGroups === true && g === options.groupSize) {
      outputText += ' ';
      g = 0; 
    } 

    let inChar = inputText.charAt(i);
    let charIdx = alphabet.indexOf(inChar.toUpperCase());

    if (alphabet.includes(inChar.toUpperCase())) {
      if (mode === "encrypt") {
        charIdx += alphabet.indexOf(keyword.charAt(k));
        if (charIdx >= alphabet.length) {
          charIdx -= alphabet.length;
        }
      } else if (mode === "decrypt") {
        charIdx -= alphabet.indexOf(keyword.charAt(i));
        if (charIdx < 0) {
          charIdx += alphabet.length; 
        }
      }

      if (inChar === inChar.toUpperCase() || options.preserveCase === false) {
        outputText += alphabet[charIdx];
      } else {
        outputText += alphabet[charIdx].toLowerCase();
      }
      g++; // increment current group size 

    } else if (inChar === ' ' && options.removeWhitespace === false && options.useGroups === false) {
      outputText += inChar;
      g++; 
    } else if (inChar !== ' ' && !alphabet.includes(inChar) && options.removeNonAlpha === false) {
      outputText += inChar; 
      g++; 
    }

    k++; // move to next keyword letter; go back to keyword[0] if you're at the end 
    if (k == keyword.length) {
      k = 0; 
    }
  }
  // pad the final block if needed 
  if (options.useGroups && options.usePadding && g > 0) {
    if (!options.nullCharacter || !alphabet.includes(options.nullCharacter)) {
      options.nullCharacter = alphabet[alphabet.length - 1];
    }
    while (g < options.groupSize) {
      let charIdx = alphabet.indexOf(options.nullCharacter); 
      if (mode === "encrypt") {
        charIdx += alphabet.indexOf(keyword.charAt(k));
        if (charIdx > alphabet.length) {
          charIdx -= alphabet.length;
        }
      } else if (mode === "decrypt") {
        charIdx -= alphabet.indexOf(keyword.charAt(k));
        if (charIdx < 0) {
          charIdx += alphabet.length; 
        }
      }
      outputText += alphabet[charIdx];
      k++; 
      if (k === keyword.length) {
        k = 0; 
      }
      g++; 
    }
  }
  return outputText; 
}

export { mapCaesar, mapAtbash, mapMonoSubstitution, applyVigenere, processMonoCipherText };