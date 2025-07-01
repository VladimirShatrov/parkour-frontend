let switches = []
let switches_price = []

fetch('http://sersh.keenetic.name:8088/switches')
  .then(res => res.json())
  .then(data => {
    switches = data.map(s => ({
      id: s.id,
      name: s.title,
      price: s.price,
      company: s.company.nameCompany,
      ups: s.ups,
      managed: s.controllable,
      PoE: s.poePorts,
      SFP: s.sfpPorts,
      current: s.available
    }));
    
    console.log(switches);
    load_button_PoE(switches)
    load_button_SFP(switches)
    attachButtonListeners()


  })
  .catch(err => console.error('Ошибка при получении данных:', err));

fetch('http://sersh.keenetic.name:8088/switch-price-history/sortedBySwitch')
    .then(res => res.json())
    .then(data => {
      // console.log('Ответ от сервера:', data);
        switches_price = data.map(s => ({
            id: s.id,
            name: s.name,
            price_history: s.prices.map(p => ({
                price: p.price,
                date: p.date
            }))
        }));

        fillPriceHistoryWithWeeklyPoints(switches_price)
        console.log(switches_price);
    })
    .catch(err => console.error('Ошибка при получении истории цен:', err));


