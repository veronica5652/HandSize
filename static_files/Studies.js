var studies = new Array();

function Study(name, getDisplayString) {
	this.name = name;
	this.getDisplayString = getDisplayString;
}

/*
 * Maternal Autism: .965 - .975
 * Paternal Autism: .945 - .955
 * Sibling controls: .98 - .995
 * Father controls: .985 - .995
 * Mother controls: .985 - .995
 * Non-autistic controls: .975 - .985
 * AS children: .9625 - .985
 * Autistic children: .945 - .955
 * Autistic-AS children: .933-.945
 * Sibilngs of Autistic children: .953 - .965
 */

var autismRatio = function(ratio) {
	var result = "<h2>" + this.name + "</h2>";
	result += "<h3>Adults...</h3>";
	if (ratio >= .965 && ratio <= .975) {
		result += "Adult females with this ratio appear to be more likely to have autistic children.<br>";
	} 
	if (ratio >= .945 && ratio <= .955) {
		result += "Adult males with this ratio appear to be more likely to have autistic children.<br>";
	}
	if (ratio >= .985 && ratio <= .995) {
		result += "Adults with this ratio appear to be unlikely candidates to have autistic children.<br>";
	}
	result += "<h3>Children...</h3>";
	if (ratio >=.98 && ratio <= .955) {
		result += "Children within this ratio appear to be more likely to have autistic siblings.<br>";
	}
	if (ratio >= .975 && ratio <=.985) {
		result += "Children with this digit ratio appear to be less likely to be autistic.<br>";
	}
	if (ratio >= .9625 && ratio <= .985) {
		result += "Children with this digit ratio appear to be more likely to have Asperger's Syndrome.<br>";
	}
	if (ratio >= .945 && ratio <= .955) {
		result += "Children with this digit ratio appear to be more likely to have autism.<br>";
	}
	if (ratio >= .933 && ratio <= .945) {
		result += "Children with this digit ratio appear to be more likely to have both Asperger's Syndrome and Autism.<br>";
	}
	if (ratio >= .953 && ratio <= .965) {
		result += "Children with this ratio appear to be more likely to have autistic siblings.<br>";
	}
	return result;
}
studies.push(new Study("The 2nd to 4th digit ratio and autism", autismRatio));

/*
 * Heterosexual women: .9675-.975
 * Homosexual women: .96 - .965
 * 
 */

var sexuality = function(ratio) {
	var result = "<h2>" + this.name + "</h2>";
	result += "<h3>Women...</h3>";
	if (ratio > .965 && ratio <= .975) {
		result += "Women with this ratio appear to be less likely to be homosexual";
	}
	if (ratio >= .96 && ratio <= .965) {
		result += "Women with this raito appear to be more likely to be homosexual";
	}
	return result;
}

studies.push(new Study("Finger-length patterns vary with gender, sexual orientation and birth order", sexuality));

/*
 * International players/coaches: .935 - .945
 * Div players: .945-.955
 */
var sports = function(ratio) {
	var result = "<h2>" + this.name + "</h2>";
	result += "<h3>Men...</h3>";
	if (ratio <= .945) {
		result += "Men with this ratio appear to be more likely to compete in professional sports.";
	} else if (ratio > .945 && ratio <= .955) {
		result += "Men with this ratio appear to be more likely to display an apptitude for sports.";
	} else {
		result += "Men with this ratio appear to be more likely to display an average or low aptitude for sports.";
	}
	return result;
}

studies.push(new Study("Second to fourth digit ratio and male ability in sport: implications for sexual selection in humans", sports));

/*
 * Aggressive men: < .94
 * Non-Aggressive men: > . 97
 * Aggressive women: < .95
 * Non-Aggressive women: .98
 */

 var aggression = function(ratio) {
 	var result = "<h2>" + this.name + "</h2>";
 	result += "<h3>Men...</h3>";

 	if (ratio <= .94) {
 		result += "Men with this ratio appear to be more likely to display aggressive tendencies.";
 	} else if (ratio >= .97) {
 		result += "Men with this ratio appear to be less likely to display aggressive tendencies.";
 	} 

 	result += "<h3>Women...</h3>";
 	if (ratio <= .95) {
 		result += "Women with this ratio appear to be more likely to display aggressive tendencies.";
 	} else if (ratio >= .98) {
 		result += "Women with this ratio appear to be less likely to display aggressive tendencies.";
 	}

 	return result;
 }

studies.push(new Study("Finger length ratio (2D:4D) and sex differences in aggression during a simulated war game", aggression));
