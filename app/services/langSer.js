angular.module('io2v3')
	.service('langSer', [function() {


		this.languages = ['en', 'ar', 'fr'];

		this.init = function()
		{

			if(localStorage.hasOwnProperty('hdrLang'))
			{
                return localStorage.getItem('hdrLang');
			}
			else {
				localStorage.setItem('hdrLang', 'en');
				return 'en';
			}

		};

		this.switchLang = function()
		{
			if(localStorage.getItem('hdrLang') == 'en')
			{
				localStorage.setItem('hdrLang', 'ar');
				return 'ar';
			}
			else {
                localStorage.setItem('hdrLang', 'en');
                return 'en';
			}

			this.init();

		};

		this.langIndex = function()
		{
			
			if(localStorage.hasOwnProperty('hdrLang'))
			{
                
                var lang = localStorage.getItem('hdrLang');
                return this.languages.indexOf(lang);

			}


		};


		this.changeLanguage = function(prefix)
		{

			if(this.languages.indexOf(prefix) != -1)
			{
				localStorage.setItem('hdrLang', prefix);
				return this.init();
			}

		};

	}]);