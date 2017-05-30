	
	/**
		* Start Parsing PDF File
		* Open PDF File First   
		* 
	**/
	
		var url = '/labcourse/doc/example.pdf';

		// The workerSrc property shall be specified.
		PDFJS.workerSrc = '/labcourse/utils/pdf.js/build/pdf.worker.js';
		
		PDFJS.getDocument(url).then(function (pdf) {
		var pdfDocument = pdf;
		var pagesPromises = [];
		var pagesAnnotation = [];
			
			for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
				
				// Required to prevent that i is always the total of pages
				(function (pageNumber) {
					pagesPromises.push(getPageText(pageNumber, pdfDocument));
					
				})
				(i + 1);
			}

			Promise.all(pagesPromises).then(
			function (pagesText) {
				
				// Remove loading text
				$("#loading-info").remove();
        
				// Render text
				for(var i = 0;i < pagesText.length;i++){
					$("#pdf-text").append("<div id=pdf-text"+ i +" "+"<h3>Page "+ (i + 1) +"</h3><p>"+pagesText[i]+"</p><br></div>")
				}
				
			});
			
			

		}, function (reason) {
		// PDF loading error
		console.error(reason);
		});


		/**
		* Retrieves the text of a specif page within a PDF Document obtained through pdf.js 
		* 
		* @param {Integer} pageNum Specifies the number of the page 
		* @param {PDFDocument} PDFDocumentInstance The PDF document obtained 
		**/
		function getPageText(pageNum, PDFDocumentInstance) {
			// Return a Promise that is solved once the text of the page is retrieven
			return new Promise(function (resolve, reject) {
			
			PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
				// The main trick to obtain the text of the PDF page, use the getTextContent method
				
				pdfPage.getTextContent().then(function (textContent) {
					var textItems = textContent.items;
					var finalString = "";
					var myArray = [];

					// Concatenate the string of the item to the final string
					for (var i = 0; i < textItems.length; i++) {
						var item = textItems[i];

						finalString += item.str + " ";
						myArray.push(item.str);
					}
					

					// Solve promise with the text retrieven from the page
					//console.log(JSON.stringify(myArray))
					
					resolve(finalString);
				});
			});
		});
		}