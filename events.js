var tryingToReset = false;
var buffer = 0;

$(".row[id]").on('click', "button", function(){
	$parent = $(this).parents(".row");

	const enemy = $parent.attr("id");
	const key = Object.keys($(this).data())[0];
	var count = 0;

	const sign = $(this).attr("class");

	if(key == "killed")
	{
		if(sign === "add")
			count = ++DropTable[enemy][key];
		else if(sign === "rem")
			count = --DropTable[enemy][key];
	}
	else
	{
		if(sign === "add")
			count = ++DropTable[enemy].drops[key].count;
		else if(sign === "rem")
			count = --DropTable[enemy].drops[key].count;
	}

	$(this).parent().siblings("[class*='count']").text(count);

	updateRates($parent);

	localStorage.FO2_DropTable = JSON.stringify(DropTable);
});

$(".row").on('click', "button.show-raw", function(){
	const enemy = $(this).parents(".row").attr("id");
	showRaw(enemy);
	$("#table").css("user-select", "none");
	$("#raw-display").show();
});

$("#top").on('click', "button.show-raw-all", function(){
	showRawAll();
	$("#table").css("user-select", "none");
	$("#raw-display").show();
});

$("#top").on('click', "button.reset", function(){
	if(!tryingToReset)
	{
		tryingToReset = true;
		$(this).text("CONFIRM?!");
	}
	else
	{
		$(this).text("RESET!");
		reset();
		location.reload();
	}
});

$(document).on('click', function(e){
	if(tryingToReset && !$(e.target).hasClass("reset"))
	{
		tryingToReset = false;
		$("#top button.reset").text("RESET!");
	}
});

$("#raw-display").on('click', "button.close", function(){
	$("#table").css("user-select", "text");
	$(this).siblings("pre").empty();
	$(this).parents("#raw-display").hide();
});

function isNumber(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
}

$("[class*='count']").on('focus', function(e){
	$(this).select();
	buffer = $(this).text();
});

$("[class*='count']").keydown(function(e){
	if(e.keyCode == 13)
	{
		e.preventDefault();

		const newCount = parseInt($(this).text());

		if(isNumber(newCount))
		{
			$parent = $(this).parents(".row");
	
			const enemy = $parent.attr("id");
			const key = Object.keys($(this).data())[0];
	
			if(key == "killed")
				DropTable[enemy][key] = newCount;
			else
				DropTable[enemy].drops[key].count = newCount;
	
			$(this).empty().text(newCount);
	
			updateRates($parent);
	
			localStorage.FO2_DropTable = JSON.stringify(DropTable);
		}
		else
		{
			$(this).empty().text(buffer);
		}

		$(this).blur();
	}
	if(e.keyCode == 0x1B)
	{
		e.preventDefault();
		$(this).blur();
	}
});

$(document).keydown(function(e) {
	//e.preventDefault();
    if (e.keyCode == 70 && e.ctrlKey)
    {
    	e.preventDefault();
    	searching = true;
    	$("#search").show().focus();
    }
});

$(document).keydown(function(e){
	if(searching && e.keyCode == 13)
	{
		searching = false;

		$hide = $(".row").filter(function(){
			return !($(this).attr("id").includes($("input#search").val()));
		}).hide();
		$show = $(".row").filter(function(){
			return $(this).attr("id").includes($("input#search").val());
		}).show();

		$("#search").hide().val("");
	}
});

$(document).keydown(function(e){
	if(searching && e.keyCode == 0x1B)
	{
		$("#search").hide().val("");
	}
});

$(document).on('mousedown', function(e){
	const $target = $(e.target);

	console.log($target);

	if($target.is("body") || $target.is("html"))
	{
		e.preventDefault();
		window.getSelection().removeAllRanges();
	}
});
