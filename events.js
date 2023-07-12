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
	$("#raw-display").show();
});

$("#raw-display").on('click', "button.close", function(){
	$(this).siblings("pre").empty();
	$(this).parents("#raw-display").hide();
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