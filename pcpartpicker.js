const puppeteer = require('puppeteer')

async function cpuScrape(url) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url)
	let components = ['', 'CPU', 'CPU COOLER', 'MOTHERBOARD', 'RAM', 'HDD/SSD', 'GPU', 'CASE', 'PSU', 'OS'];
	let componentsData = [];
	var i;
	for (i=1; i < 10; i++) {
		console.log('\n'+components[i])
		const [cpuImage] = await page.$x('//*[@id="partlist"]/div[2]/section[2]/div/div[2]/table/tbody/tr['+i+']/td[3]/a/img');
		const cpuImageSrc = await cpuImage.getProperty('src');
		const cpuImageCdn = await cpuImageSrc.jsonValue();
		componentsData.push(cpuImageCdn);
		console.log('IMAGE: ' + cpuImageCdn)
		
		const [cpuName] = await page.$x('//*[@id="partlist"]/div[2]/section[2]/div/div[2]/table/tbody/tr['+i+']/td[4]/a')
		const cpuNameText = await page.evaluate(cpuName => cpuName.textContent, cpuName);
		componentsData.push(cpuNameText);
		console.log('NAME: '+cpuNameText);
			
		try {
			const [cpuPrice] = await page.$x('//*[@id="partlist"]/div[2]/section[2]/div/div[2]/table/tbody/tr['+i+']/td[5]/text()');
			const cpuPriceText = await page.evaluate(cpuPrice => cpuPrice.textContent, cpuPrice);
			componentsData.push(cpuPriceText);
			console.log('PRICE: '+cpuPriceText)
		}
		catch (err) {
			console.log('No Price');
		}

		const [cpuCheapest] = await page.$x('//*[@id="partlist"]/div[2]/section[2]/div/div[2]/table/tbody/tr['+i+']/td[11]/a')
		const cpuRedirect = await cpuCheapest.getProperty('href');
		const cpuRedirectLink = await cpuRedirect.jsonValue();
		componentsData.push(cpuRedirectLink);
		console.log('REFERRAL LINK: ' + cpuRedirectLink);

		try {
			const [cpuCheapestImg] = await page.$x('//*[@id="partlist"]/div[2]/section[2]/div/div[2]/table/tbody/tr['+i+']/td[10]/a/img')
			const cpuCheapestImgSrc = await cpuCheapestImg.getProperty('src');
			const cpuImgSrc = await cpuCheapestImgSrc.jsonValue();
			componentsData.push(cpuImgSrc);
			console.log('WHERE: ' + cpuImgSrc);
		} 
		catch (err) {
			console.log('WHERE: '+'NOT AVAILABLE')
		}

		return componentsData;

	}
}



module.exports.cpuScrape = cpuScrape;
//cpuScrape('https://pcpartpicker.com/list/TYNrk6')
