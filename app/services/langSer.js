angular.module('io2v3')
	.service('langSer', [function() {

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
			if( localStorage.getItem('hdrLang') == 'en' )
			{
				return 0;
			}
			else if (localStorage.getItem('hdrLang') == 'ar')
			{
				return 1;
			}
			else {
				return 2;
			}
		};

	}]);