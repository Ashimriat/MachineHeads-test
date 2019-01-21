import $ from 'jquery';
import './styles/main.scss';

class MainPageManager {
  constructor() {
    this.$mainMenu = $('#mainMenu');
    this.$forClients = {
      container: $('.clients'),
      menuContainer: $('.clients__dropDownMenuContainer'),
      menu: $('.clients__dropDownMenuContainer__dropDownMenu'),
      arrow: $('.arrowIcon')
    };
    this.$troubles = {
      container: $('.troubles'),
      triggers: [$('.repair'), $('.problems'), $('.header__mainMenu__troublesMenu__closeIcon')],
      menu: $('.troublesMenu'),
      devicesList: $('#devicesList'),
      deviceModelsList: $('#deviceModelsList'),
      cases: $('#troublesCases'),
      select: $('.header__mainMenu__troublesMenu__mobileDeviceModelsList__select'),
      selectArrow: $('.header__mainMenu__troublesMenu__mobileDeviceModelsList__arrowIcon .arrowIcon')
    };
    this.$banners = {
      img: $('#bannerImg'),
      counter: $('#bannersCounter')
    };
    this.$buttons = {
      mobileMenu: $('.mobileMenuButton'),
      diagnostics: $('.diagnosticsButton'),
      thanks: $('#thanksButton'),
      confirm: {
        modal: $('#modalRecord .confirmButton'),
        noModal: $('.recordArea .confirmButton')
      },
      close: {
        record: $('#modalRecord .closeIcon'),
        thanks: $('#modalThanks .closeIcon')
      }
    };
    this.$modals = {
      record: $('#modalRecord'),
      thanks: $('#modalThanks'),
    };
    this.isOpened = {
      mobileMenu: false,
      clientsMenu: false,
      troublesMenu: false,
      troublesSelect: false,
      recordModal: false,
      thanksModal: false,
    };
    this.currentBannerIndex = 0;
    this.devicesModels = {
      iPhone: [
        '4', '4s', '5', '5s', 'SE',
        '6', '6Plus', '7', '7Plus',
        '8', '8Plus', 'X', 'XS', 'Xs Max'
      ],
      iPad: [
        '1', '2', '3', '4',
        'Mini', 'Air 2', 'Mini 3', 'Pro',
        'Mini 4', 'Pro 9.7', '5g', 'Pro 2',
        'Pro 10.5', '6g'
      ],
      mac: ["21.5'", "27'", "Pro", "Mini"]
    };
    this.devicesTroubles = {
      iPhone: [
        {title: 'Дисплей', cases: ['Разбился экран', 'Испортилась цветопередача']},
        {title: 'Прошивка', cases: ['Не удаляется приложение']},
      ],
      iPad: [
        {title: 'Батарея', cases: ['Вздулась батарея', 'Батарея не держит заряд']},
        {title: 'Звук', cases: ['Повреждён динамик']},
        {title: 'Разъёмы', cases: ['Не работают наушники']},
        {title: 'Дисплей', cases: ['Разбился экран', 'Испортилась цветопередача']},
        {title: 'Прошивка', cases: ['Не удаляется приложение']},
      ],
      mac: [
        {title: 'Порты', cases: ['Отсутствует Ethernet порт', 'Повреждён Ethernet порт']},
        {title: 'Дисплей', cases: ['Разбился экран', 'Испортилась цветопередача']},
        {title: 'ОС', cases: ['Синий экран смерти']},
      ],

    }
  }

  init() {
    this.initDropDownMenus();
    this.initBanners();
    this.initButtonsActions();
  };

  toggleElement(isElementVisible, element, mustDelay, callback) {
    if (!isElementVisible) {
      element.removeClass('hidden');
    } else {
      setTimeout(() => element.addClass('hidden'), mustDelay ? 510 : 0);
    }
    setTimeout(() => element.toggleClass('transparent opaque'), 10);
    callback();
  }

  initDropDownMenus() {
    const self = this;

    //init forClientsMenu
    const toggleClientsDropDownMenu = () => self.toggleElement(
      self.isOpened.clientsMenu,
      self.$forClients.menuContainer,
      false,
      () => self.isOpened.clientsMenu = !self.isOpened.clientsMenu
    );
    this.$forClients.container.hover(() => {
      toggleClientsDropDownMenu();
      self.$forClients.arrow.toggleClass('arrowIcon--down arrowIcon--up');
    });

    //init troublesMenu
    const toggleTroubles = () => {
      self.toggleElement(
        self.isOpened.troublesMenu,
        self.$troubles.menu,
        false,
        () => self.isOpened.troublesMenu = !self.isOpened.troublesMenu
      );
    };
    const devicesIndexes = {
      0: 'iPhone',
      1: 'iPad',
      2: 'mac'
    };
    const fillDeviceModels = devicesIndex => {
      const modelsItems = self.devicesModels[devicesIndexes[devicesIndex]].map((model, index) => {
        const $modelElement = $('<li></li>').text(model).addClass('header__mainMenu__troublesMenu__deviceModelsList__item');
        if (index == 0) {
          $modelElement.addClass('header__mainMenu__troublesMenu__deviceModelsList__item--chosen');
        }
        return $modelElement;
      });
      const troublesItems = self.devicesTroubles[devicesIndexes[devicesIndex]].map(trouble => {
        const $troubleElement = $(
          `<ul class="header__mainMenu__troublesMenu__cases__lists__list"></ul>`
        );
        const $troubleElementTitle = $(
          `<span class="header__mainMenu__troublesMenu__cases__lists__list__title">${trouble.title}</span>`
        );
        const $troubleElementCases = trouble.cases.map(caseName => {
          return $(
              `<li class="header__mainMenu__troublesMenu__cases__lists__list__item casesText"></li>`
            )
            .append(`<p>${caseName}</p>`)
            .append('<span class="arrowIcon arrowIcon--right"></span>');
        });
        return $troubleElement.append($troubleElementTitle).append($troubleElementCases);
      });
      self.$troubles.deviceModelsList.find('.header__mainMenu__troublesMenu__deviceModelsList__item').remove();
      for (let i = (modelsItems.length - 1); i >= 0; i--) {
        self.$troubles.deviceModelsList.prepend(modelsItems[i]);
      }
      self.$troubles.cases.find('.header__mainMenu__troublesMenu__cases__lists__list').remove();
      troublesItems.forEach(troubleItem => self.$troubles.cases.append(troubleItem));
    };
    this.$troubles.container.hover(() => window.innerWidth >= 961 && toggleTroubles());
    this.$troubles.triggers.forEach(trigger => {
      trigger.click(() => {
        if (window.innerWidth <= 960) {
          toggleTroubles();
          self.$mainMenu.toggleClass('static');
          self.$buttons.mobileMenu.toggleClass('hidden');
        }
      });
    });
    this.$troubles.select.click(e => {
      e.stopPropagation();
      self.$troubles.selectArrow.toggleClass('arrowIcon--up arrowIcon--down');
      self.isOpened.troublesSelect = true;
    });
    this.$troubles.menu.click(() => {
      if (self.isOpened.troublesSelect) {
        self.$troubles.selectArrow.toggleClass('arrowIcon--up arrowIcon--down');
        self.isOpened.troublesSelect = false;
      }
    });
    this.$troubles.devicesList
      .find('.header__mainMenu__troublesMenu__devicesList__item')
      .each((index, elem) => {
        $(elem).click(e => {
          //change visual
          self.$troubles.devicesList
            .find('.header__mainMenu__troublesMenu__devicesList__item--chosen')
            .removeClass('header__mainMenu__troublesMenu__devicesList__item--chosen')
            .find('path')
            .each((index, path) => $(path).attr('fill', '#646f75'));
          self.$troubles.devicesList
            .find('.header__mainMenu__troublesMenu__devicesList__item__deviceName--chosen')
            .removeClass('header__mainMenu__troublesMenu__devicesList__item__deviceName--chosen');
          $(elem).addClass('header__mainMenu__troublesMenu__devicesList__item--chosen');
          $(elem).find('.header__mainMenu__troublesMenu__devicesList__item__deviceName')
            .addClass('header__mainMenu__troublesMenu__devicesList__item__deviceName--chosen');
          $(elem).find('path').each((index, path) => $(path).attr('fill', '#f46841'));

          fillDeviceModels(index);
        });
    });
    this.$troubles.deviceModelsList
      .find('.header__mainMenu__troublesMenu__deviceModelsList__item')
      .each((index, elem) => {
        $(elem).click(e => {
          self.$troubles.deviceModelsList
            .find('.header__mainMenu__troublesMenu__deviceModelsList__item--chosen')
            .removeClass('header__mainMenu__troublesMenu__deviceModelsList__item--chosen');
          $(elem).addClass('header__mainMenu__troublesMenu__deviceModelsList__item--chosen');
        });
    });
    fillDeviceModels(0);
  };

  initBanners() {
    const self = this;
    const toggleBannerCounter = () => {
      self.$banners.counter.children().eq(self.currentBannerIndex)
        .toggleClass('bannersArea__counter__count--active');
    };
    this.$banners.img.click(() => {
      toggleBannerCounter();
      if (self.currentBannerIndex == 3) {
        self.currentBannerIndex = 0;
      } else {
        self.currentBannerIndex++;
      }
      this.$banners.img.attr('src', `assets/images/banners/${self.currentBannerIndex}.png`);
      toggleBannerCounter();
    });
  }

  initButtonsActions() {
    const self = this;
    const toggleModal = modalType => self.toggleElement(
      self.isOpened[`${modalType}Modal`],
      self.$modals[modalType],
      true,
      () => self.isOpened[`${modalType}Modal`] = !self.isOpened[`${modalType}Modal`]
    );

    this.$buttons.mobileMenu.click(() => {
      self.$buttons.mobileMenu.toggleClass('mobileMenuButton--menuOpened');
      !self.$mainMenu.hasClass('flex') && self.$mainMenu.addClass('flex');
      setTimeout(() => self.$mainMenu.toggleClass('menu--opened'), 10);
      self.isOpened.mobileMenu = !self.isOpened.mobileMenu;
    });
    [
      this.$buttons.confirm.noModal,
      this.$buttons.thanks,
      this.$buttons.close.thanks
    ].forEach(button => button.click(toggleModal.bind(null, 'thanks')));
    [
      this.$buttons.close.record,
      this.$buttons.diagnostics
    ].forEach(button => button.click(toggleModal.bind(null, 'record')));
    this.$buttons.confirm.modal.click(() => {
      toggleModal('record');
      toggleModal('thanks');
    })
  };
}

$().ready(() => {
  let mainPageManager = new MainPageManager();
  mainPageManager.init();
});