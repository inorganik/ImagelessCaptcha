/*
	
	IMAGELESS CAPTCHA
	
*/

// numDigits - number of digits in the number, default 3, max 4. 0 becomes default.
// useDecimal - (Boolean) whether or not to use a decimal, default false
// decimalChance - makes whether a decimal is added random, used only if useDecimal is true, default false

function imagelessCaptcha(numDigits, useDecimal, decimalChance) {
	
	var self = this;

	this.numDigits = numDigits || 3;
	if (this.numDigits > 4) {
        console.log('imagelessCaptcha error: numDigits maximum is 4');
        return;
    }
	this.useDecimal = useDecimal || false;
	this.decimalChance = decimalChance || false;

	this.ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
	this.teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
	this.tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
	this.phraseBeginning = ['How is ', 'What is '];

	var min = Math.pow(10, this.numDigits - 1);
	var max = Math.pow(10, this.numDigits) - 1;
    this.number =  Math.round(Math.random() * (max - min) + min);
	
	// form word phrase for tens digits
	this.formTens = function(num, and) {
		num = Number(num);
		numString = String(num);
		var and = and || false;
		var phrase = '';
		if (num < 10) {
			if (num == 0) and = false;
			phrase = self.ones[num];
		} 
		else if (num < 20) {
			phrase = self.teens[num-10];
		}
		else {
			var digitTens = Number(numString.substr(0, 1));
			var digitOnes = Number(numString.substr(1, 1));
			if (digitOnes != 0) {
				phrase = self.tens[digitTens]+'-'+self.ones[digitOnes];
			} else {
				phrase = self.tens[digitTens];
			}
		}
		if (and) phrase = 'and '+phrase;
		return phrase;
	}
	// create the number phrase
	this.formPhrase = function() {
		var phrase, start;
		var numberString = String(self.number);
		if (self.number < 100) {
			phrase = self.formTens(self.number);
		}
		else if (self.number < 1000) {
			phrase = self.ones[numberString.substr(0, 1)]+'-hundred ';
			phrase += self.formTens(numberString.substr(1, 2), true);
		}
		else if (self.number < 10000) {
			phrase = self.ones[numberString.substr(0, 1)]+'-thousand ';
			var hundreds = Number(numberString.substr(1, 1));
			if (hundreds > 0) phrase += self.ones[hundreds]+'-hundred ';
			phrase += self.formTens(numberString.substr(2, 2), true);
		}
		// decimal
		if (self.useDecimal == true) {
			var dec;
			if (self.decimalChance == true) {
				self.useDecimal = Math.round(Math.random());
				if (self.useDecimal) {
					dec = Math.round(Math.random() * 9);
					self.number = self.number + (dec *.1);
					phrase += ' point '+self.ones[dec];
				}
			} else {
				dec = Math.round(Math.random() * 9);
				self.number = self.number + (dec *.1);
				phrase += ' point '+self.ones[dec];
			}
		}
		// randomize beginning of phrase, throw off parsers
		start = Math.round(Math.random());
		// final phrase
		return self.phraseBeginning[start] + phrase + ' written as a number?';
	}
	// return the int
	this.getInt = function() {
		if (self.useDecimal == true) self.number = self.number.toFixed(1);
		return self.number;
	}
}  