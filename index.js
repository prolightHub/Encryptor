var seeder = {
    splitValues: function(seed, entries, filler)
    {
        var aVal = 0, curVal = 0;
           
        for(var i = 0; i < entries.length; i++)
        {
            curVal = (entries[i] / seed) * (filler[i] || 1);

            if(curVal)
            {
                aVal += curVal;
            }
        }

        return 1 / aVal;
    },
    splitNumber: function(num)
    {
        var digits = String(num).split("").map(Number);
        
        var entries = [];
        digits.forEach(function(element, index, array) 
        {
            entries.push(Number(element.toString() + '0'.repeat(array.length - index - 1)));
        });

        return entries;
    },
    encrypt: function(num, seed, filler)
    {
        return this.splitValues(seed, this.splitNumber(num), filler = String(filler).split("").map(Number));
    },
    decrypt: function(num, seed, filler)
    {
        filler = String(filler).split("").map(Number);

        var aVal = 0;
        this.splitNumber(seed * (1 / num)).forEach(function(element, index, array)
        {
            aVal += element / (filler[index] || 1);
        });

        return aVal;
    }
}; 


var numSeeder = {
    splitValues: function(seed, entries, filler)
    {
        var aVal = BigNumber("0"), curVal;
           
        for(var i = 0; i < entries.length; i++)
        {
            if(entries[i] === ".")
            {
                continue;
            }

            curVal = (BigNumber(entries[i]).div(seed)).times(filler[i] || 1);

            aVal = aVal.plus(curVal);
        }

        return BigNumber("1").div(aVal);
    },
    splitNumber: function(num)
    {
        var sides = String(num.toString()).replace("-", "").split(".");

        var entries = [];
        sides[0].split("").forEach(function(element, index, array)
        {
            entries.push(element + "0".repeat(array.length - 1 - index));
        });
        if(sides.length >= 2)
        {
            entries.push(".");
            sides[1].split("").forEach(function(element, index, array)
            {
                entries.push("0".repeat(index) + element);
            });
        }

        return entries;
    },
    encrypt: function(num, seed, filler)
    {
        return this.splitValues(BigNumber(seed), this.splitNumber(BigNumber(num)), 
            filler = String(filler).replace("-", "").split("").map(Number)).toString();
    },
    decrypt: function(num, seed, filler)
    {
        filler = String(filler).replace("-", "").split("").map(Number);

        var aVal = BigNumber("0");
        var numToSplit = BigNumber(seed).times(BigNumber("1").div(BigNumber(num))).toString();
        console.log(numToSplit);

        aVal = f$(numToSplit, filler);

        return aVal;
    }
}; 

function f$(numToSplit, filler)
{
    var aVal = BigNumber("0");
    var split = numSeeder.splitNumber(numToSplit);
        
    split.some(function(element, index, array)
    {
        if(element.toString() === ".")
        {
            return true;
        }

        var num = BigNumber(element).div(BigNumber(filler[index] || 1));
        aVal = aVal.plus(num);
    });

    var hit = false;
    while(!hit)
    {
        hit = (split[0] === "." || split.length === 0);
        split.shift();
    }

    split.forEach(function(element, index, array)
    {
        var num = BigNumber("0." + element).div(BigNumber(filler[index] || 1));
        aVal = aVal.plus(num);
    });

    return aVal;
}

var generator = {
	encrypt: function(num, seed, filler)
	{
		return numSeeder.encrypt(num, seed, filler).toString() + ":" + seed.toString() + ":" + filler.toString();
	},
	decrypt: function(data)
	{
		var args = data.split(":");
		return numSeeder.decrypt(Number(args[0]), Number(args[1]), Number(args[2]));
	}
};

var charCodes = {

    // Converts a string to a string of char codes (unseperated)
    encode: function(str, digits) 
    {
        digits = digits || 5;

        var input = str.split("");
        var out = "";
        for (i = 0; i < input.length; i++) 
        {
            out += charCodes.fillCharCode(input[i].charCodeAt(0), digits);
        }
        return "1" + out;
    },

    //Fills in extra zeros at the beginning until it fits the length.
    fillCharCode: function(code, length, char)
    {
        length = length || 5;
        char = char || 0;

        var val = String(code).split("").map(Number);

        while(val.length < length)
        {
            val.unshift(char);
        }

        return val.join("");
    },

    // Converts a string of char codes to a string of symbols
    decode: function(str, digits)
    {
        digits = digits || 5;

        var pads = [];
        var array = str.split("");

        // Seperate string by every 5 chars
        for(var i = 1; i < array.length; i++)
        {
            var n = Math.floor((i - 1) / digits);

            pads[n] = pads[n] || "";
            pads[n] += array[i];
        }
        
        var data = "";

        // Build string from char codes.
        for(var i = 0; i < pads.length; i++)
        {
            data += String.fromCharCode(Number(pads[i]));
        }
        
        return data;
    }
};

var obj = { x: 44, y: 55, z: 77 };

Object.prototype.toBigInt = function()
{
    return BigInt(charCodes.encode(JSON.stringify(this)));
};
BigInt.prototype.toObject = function()
{
    return JSON.parse(charCodes.decode(this.toString(), 5));
};
