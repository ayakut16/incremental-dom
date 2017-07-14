function createTests() {
    var elementOpen = IncrementalDOM.elementOpen;
    var elementClose = IncrementalDOM.elementClose;
    var text = IncrementalDOM.text;
    var patch = IncrementalDOM.patch;
    var container = document.createElement('div');
    var testContainer = document.createElement('div');
    var items = Items.list;
    var running = false;
    var results = [];

    var buttons = [
        {
            name: 'Reverse',
            action: reverse
        },
        {
            name: 'Shuffle',
            action: shuffle
        }
    ];
    document.body.appendChild(container);
    document.body.appendChild(testContainer);




    function shuffle() {
        var array = items;
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

    }

    function reverse() {
        var array = items;
        var len = array.length
        for(var i = 0 ; i < len/2; i++){
            var temp = array[i];
            array[i] = array[len-i-1];
            array[len-i-1] = temp;
        }
    }

    function appendToList() {
        items.push(ListSetup.createItem());
    }

    function update(key) {
        patch(testContainer, function(){render(key)});
    }

    function render(key) {
        elementOpen('ul',null,null,'id','list');
        for (var i = 0; i < items.length; i++) {
            elementOpen('li',key ? items[i].key:null,null,'class','message');
                text((i+1) + '. ' + items[i].sender);
            elementClose('li');
        }
        elementClose('ul');
    }

    function test(fn){

        results = [];
        running = true;

        setButtons();


        /*
        * Testing
        * */
        var suite = new Benchmark.Suite;
        suite
            .add('With key', function() {
                fn();
                update(true);
            })
            .add('Without Key', function () {
                fn();
                update(false);
            })
            .on('cycle', function(event) {
                results.push(String(event.target));
            })

            .on('complete', function() {
                results.push('Fastest is ' + this.filter('fastest').map('name'));
                running = false;
                setButtons();
            })
            .run({ 'async': true });


    }

    function setButtons(){
        patch(container, ()=>{
            buttons.forEach(function (button) {
                elementOpen('button', null, null,
                            'disabled', running || undefined,
                            'onclick', function() {
                                test(button.action);
                            });
                    text(button.name);
                elementClose('button');
            });

            elementOpen('div');

            if (running) {
                text('.....running.....');
            }
            else{
                results.forEach(function (result) {
                    text(result);
                    elementOpen('br');
                    elementClose('br');
                });
            }

            elementClose('div');
        });
    }

    function initialRender() {
        patch(testContainer, function(){render();});
    }

    setButtons();
    initialRender();
}