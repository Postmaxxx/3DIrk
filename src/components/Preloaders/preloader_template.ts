const preloader = (): string => {
	return `
        <div class='preloader__container' title={"Please wait. Пожалуйста, подождите"}>
            <div class="preloader"></div>
            <p class='preloader__text'></p>
        </div>`;
};

export default preloader;