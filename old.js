var numSeeder = {
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
