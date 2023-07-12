
DropTable = null;
searching = false;

function showRawAll()
{
	for(const enemy in DropTable)
	{
		showRaw(enemy);
	}
	$("#raw-display").show();
}

function showRaw(enemy)
{
	const name = DropTable[enemy].name;
	const killed = DropTable[enemy].killed;

	var str = name + ";" + killed + "\n";

	for(const item in DropTable[enemy].drops)
	{
		const itemName = DropTable[enemy].drops[item].name;
		const count = DropTable[enemy].drops[item].count;
		const rate = (parseInt(count) / parseInt(killed)).toFixed(4);
		str += itemName + ";" + count + ";" + rate + "\n";
	}

	str += "\n";

	$("#raw-display pre").append(str);
}

function updateLocalStorage()
{
	if(!("FO2_DropTable" in localStorage))
	{
		localStorage.FO2_DropTable = JSON.stringify(FO2DataObj);
	}

	var update = false;

	DropTable = JSON.parse(localStorage.FO2_DropTable);

	const savedKeys = Object.keys(DropTable);
	const dataKeys = Object.keys(FO2DataObj);

	if(!(savedKeys.length == dataKeys.length) && savedKeys.every(el => dataKeys.includes(el)))
	{
		update = true;
		// data.js got updated, lets update it to local storage too
		const difference = dataKeys.filter(x => !savedKeys.includes(x));

		difference.every(el => {
			DropTable[el] = FO2DataObj[el];
		});
	}

	for(const key in DropTable)
	{
		const savedDrops = Object.keys(DropTable[key].drops);
		const dataDrops = Object.keys(FO2DataObj[key].drops);

		if(!(savedDrops.length == dataDrops.length) && savedDrops.every(el => dataDrops.includes(el)))
		{
			update = true;
			const difference = dataDrops.filter(x => !savedDrops.includes(x));
	
			difference.every(el => {
				DropTable[key].drops[el] = FO2DataObj[key].drops[el];
			});
		}
	}

	if(update)
	{
		localStorage.FO2_DropTable = JSON.stringify(DropTable);
	}
}

function reset()
{
	// DANGEROUS!
	delete localStorage.FO2_DropTable;
}

function updateRates($element)
{
	if(DropTable === null)
	{
		console.log("DropTable is null!");
		return;
	}

	const enemy = $element.attr("id");

	const obj = DropTable[enemy];

	const killed = obj.killed;
	const items = obj.drops;

	for(const item in items)
	{
		const count = items[item].count;

		const rate = (parseInt(count) / parseInt(killed) * 100).toFixed(2);
		$element.find("#" + item + ".rate").empty().text(rate + "%");
	}
}

// called on load
function generateRows()
{
	if(DropTable === null)
	{
		console.log("DropTable is null!");
		return;
	}

	for(const enemy in DropTable)
	{
		const obj = DropTable[enemy];
		const enemyName = obj.name;
		const killed = obj.killed;

		$counter = function(key, value)
		{
			var c = "count";
			if(key == "killed") c = "kill-" + c;

			const $count = $("<label>").attr("contenteditable", true).addClass(c).text(value).data(key, value);
			const $add = $("<button>").addClass("add").text("+").data(key, value);
			const $rem = $("<button>").addClass("rem").text("-").data(key, value);
			return [$count, $("<span>").addClass("buttons").append($add, $rem)];
		};

		$row = $("<span>").addClass("row").attr("id", enemy).appendTo("#table");
		
		// grid elements of $row
		$items = $("<span>").addClass("items").appendTo($row);
		$kills = $("<span>").addClass("kills").append($counter("killed", killed)).appendTo($row);
		$filters = $("<span>").addClass("filters").appendTo($row);
		// name
		$("<span>").addClass("enemy-name").text(enemyName).prependTo($row);

		//$("<label>").addClass("kill-count").text(killed).prependTo($kills);
		$("<button>").addClass("show-raw").text("show raw").appendTo($filters);

		const items = obj.drops;

		for(const item in items)
		{
			const itemName = items[item].name;
			const count = items[item].count;

			$item = $("<span>").addClass("item").appendTo($items).append($counter(item, count));
			//$("<span>").addClass("count").prependTo($item).text(count);
			$("<label>").text(itemName).prependTo($item);

			const rate = (parseInt(count) / parseInt(killed) * 100).toFixed(2);
			$("<span>").addClass("rate").attr("id", item).text(rate + "%").appendTo($item);
		}
	}
}
