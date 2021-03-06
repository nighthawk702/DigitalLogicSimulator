/// <reference path="simulator.ts" />

module Components {

    var linkColor = "#aaa";
    var outputEndpoint = {
        endpoint:["Dot", { radius:8 }],
        paintStyle:{ fillStyle:linkColor },
        isTarget:true,
        isSource:true,
        scope:"logicConnections",
        connectorStyle:{ strokeStyle:linkColor, lineWidth:6 },
        connector: ["Flowchart", { } ],
        maxConnections:10
    };

    var inputEndpoint = {
        endpoint:["Dot", { radius:8}],
        paintStyle:{ fillStyle:linkColor },
        isTarget:true,
        scope:"logicConnections",
        connectorStyle:{ strokeStyle:linkColor, lineWidth:6 },
        connector: ["Flowchart", { } ],
        maxConnections:1
    };

    class HTMLComponent extends Simulator.Component {
        public contDiv:JQuery;
        constructor(nInputs:number,nOutputs:number,posx:number,posy:number,compName:string) {
            super(nInputs,nOutputs);
            this.contDiv = $("<div id=" + this.name + "></div>").addClass("component").addClass(compName);
            $("#screen").append(this.contDiv);
            var spos = $("#screen").offset()
            Simulator.addComponent(this.name,this);
            this.contDiv.offset({ top: spos.top + posy, left: spos.left + posx });
            jsPlumb.draggable(this.contDiv, {containment:$("#screen")});
        }
    }

    export class Switch extends HTMLComponent {
        private value:boolean;
        static compCount = 0;
        static componentName = "switch";
        constructor(posx:number,posy:number) {
            this.name = Switch.componentName + Switch.compCount;
            Switch.compCount += 1;

            this.value = false;

            super(0,1,posx,posy,Switch.componentName);

            this.contDiv.append($("<img src=\"simulator/gates/switch_off.png\"></>"));

            this.contDiv.click({ parent: this }, function (event) {
                if (event.data.parent.value) {
                    event.data.parent.value = false;
                    event.data.parent.contDiv.children("img").attr("src","simulator/gates/switch_off.png");
                }
                else {
                    event.data.parent.value = true;
                    event.data.parent.contDiv.children("img").attr("src","simulator/gates/switch_on.png");
                }
                event.data.parent.update();
            });

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function () {
                    this.outputValue[0] = this.value;
            }
        }
    }

    export class Light extends HTMLComponent {
        static compCount:number = 0;
        static componentName:string = "light";

        constructor(posx:number,posy:number) {
            this.name = Light.componentName + Light.compCount;
            Light.compCount+=1;

            super(1,0,posx,posy,Light.componentName);

            this.contDiv.append($("<img src=\"simulator/gates/light_off.png\"></>"));

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Bottom"},inputEndpoint).id = this.name+"-i0";

            this.evaluate = function () {
                if (this.inputValue[0]) {
                    this.contDiv.children("img").attr("src","simulator/gates/light_on.png");
                }
                else {
                    this.contDiv.children("img").attr("src","simulator/gates/light_off.png");
                }
            }
        }
        removeInput(index:number):void {
            super.removeInput(index);
            this.contDiv.children("img").attr("src","simulator/gates/light_off.png");
        }
    }

    // export class True extends HTMLComponent {
    //     static compCount:number = 0;
    //     static componentName:string = "true";
    //     constructor(posx:number,posy:number) {
    //         this.name = True.componentName + True.compCount;
    //         True.compCount+=1;

    //         super(0,1,posx,posy,True.componentName);

    //         jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

    //         this.evaluate = function() {
    //             this.outputValue[0] = true;
    //         }
    //     }
    // }

    // export class False extends HTMLComponent {
    //     static compCount:number = 0;
    //     static componentName:string = "false";
    //     constructor(posx:number,posy:number) {
    //         this.name = False.componentName + False.compCount;
    //         False.compCount+=1;

    //         super(0,1,posx,posy,False.componentName);

    //         jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";
    //         this.evaluate = function() {
    //             this.outputs[0].value = false;
    //         }
    //     }
    // }

    export class Not extends HTMLComponent {
        static compCount:number = 0;
        static componentName:string = "not";
        constructor(posx:number,posy:number) {
            this.name = Not.componentName + Not.compCount;
            Not.compCount+=1;

            super(1,1,posx,posy,Not.componentName);
            this.contDiv.append($("<img src=\"gates\\"+Not.componentName + ".png\"></>"));

            jsPlumb.addEndpoint(this.contDiv,{anchor:"Left"},inputEndpoint).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function() {
                this.outputValue[0] = !this.inputValue[0];
            }
        }
    }

    export class Or extends HTMLComponent {
        static compCount:number = 0;
        static componentName:string = "or";
        constructor(posx:number,posy:number) {
            this.name = Or.componentName + Or.compCount;
            Or.compCount+=1;

            super(2,1,posx,posy,Or.componentName);
            this.contDiv.append($("<img src=\"gates\\"+ Or.componentName + ".png\"></>"))

            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.3,0,0]},inputEndpoint).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.7,0,0]},inputEndpoint).id = this.name+"-i1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function() {
                this.outputValue[0] = this.inputValue[0] || this.inputValue[1];
            }
        }
    }

    export class Xor extends HTMLComponent {
        static compCount:number = 0;
        static componentName:string = "xor";
        constructor(posx:number,posy:number) {
            this.name = Xor.componentName + Xor.compCount;
            Xor.compCount+=1;

            super(2,1,posx,posy,Xor.componentName);
            this.contDiv.append($("<img src=\"gates\\"+Xor.componentName + ".png\"></>"))

            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.3,0,0]},inputEndpoint).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.7,0,0]},inputEndpoint).id = this.name+"-i1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function() {
                this.outputValue[0] = this.inputValue[0] ^ this.inputValue[1];
            }
        }
    }

    export class And extends HTMLComponent {
        static compCount:number = 0;
        static componentName:string = "and";
        constructor(posx:number,posy:number) {
            this.name = And.componentName + And.compCount;
            And.compCount+=1;

            super(2,1,posx,posy,And.componentName);
            this.contDiv.append($("<img src=\"gates\\"+And.componentName + ".png\"></>"))

            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.3,0,0]},inputEndpoint).id = this.name+"-i0";
            jsPlumb.addEndpoint(this.contDiv,{anchor:[0,0.7,0,0]},inputEndpoint).id = this.name+"-i1";
            jsPlumb.addEndpoint(this.contDiv,{anchor:"Right"},outputEndpoint).id = this.name+"-o0";

            this.evaluate = function() {
                this.outputValue[0] = this.inputValue[0] && this.inputValue[1];
            }
        }
    }
}
    // export class Splitter extends HTMLComponent {
    //     static compCount:number = 0;
    //     static componentName:string = "splitter";
    //     constructor(posx:number,posy:number) {
    //         this.name = Splitter.componentName + Splitter.compCount;
    //         Splitter.compCount+=1;

    //         super(1,2,posx,posy,Splitter.componentName);


    //         jsPlumb.addEndpoint(this.contDiv,{anchor:"TopRight"},outputEndpoint).id = this.name+"-o0";
    //         jsPlumb.addEndpoint(this.contDiv,{anchor:"BottomRight"},outputEndpoint).id = this.name+"-o1";
    //         jsPlumb.addEndpoint(this.contDiv,{anchor:"Left"},inputEndpoint).id = this.name+"-10";

    //         this.evaluate = function() {
    //             if(this.outputs[0] != undefined) {
    //                 this.outputs[0].value = this.inputs[0].value;
    //             }
    //             if(this.outputs[1] != undefined) {
    //                 this.outputs[1].value = this.inputs[0].value;
    //             }
    //         }
    //     }
    // }

jsPlumb.ready(function() {

    jsPlumb.setContainer($("#screen"));

    jsPlumb.doWhileSuspended(function () {
        jsPlumb.bind("connection", function(info, originalEvent) {
            var sourceid = info.source.id;
            var targetid = info.target.id;
            var sourceepid = +(info.sourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.targetEndpoint.id.split("-")[1].substring(1));
            console.log("Connection detached from ", sourceid,"(",sourceepid, ") to ",targetid,"(",targetepid,").");
            //Simulator.connect(Simulator.getComponent(targetid),targetepid,Simulator.getComponent(sourceid),sourceepid);
            Simulator.connect(Simulator.getComponent(sourceid),sourceepid,Simulator.getComponent(targetid),targetepid);
        });

        jsPlumb.bind("connectionDetached", function(info, originalEvent) {
            var sourceid = info.source.id;
            var targetid = info.target.id;
            var sourceepid = +(info.sourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.targetEndpoint.id.split("-")[1].substring(1));
            console.log("Connection detached from ", sourceid,"(",sourceepid, ") to ",targetid,"(",targetepid,").");
            Simulator.disconnect(Simulator.getComponent(sourceid),sourceepid,Simulator.getComponent(targetid),targetepid);
            //Simulator.disconnect(Simulator.getComponent(targetid),targetepid,Simulator.getComponent(sourceid),sourceepid);
        });

        jsPlumb.bind("connectionMoved", function(info, originalEvent) {
            var sourceid = info.originalSourceId;
            var targetid = info.originalTargetId;
            var sourceepid = +(info.originalSourceEndpoint.id.split("-")[1].substring(1));
            var targetepid = +(info.originalTargetEndpoint.id.split("-")[1].substring(1));
            console.log("Connection detached from ", sourceid,"(",sourceepid, ") to ",targetid,"(",targetepid,").");
            Simulator.disconnect(Simulator.getComponent(sourceid),sourceepid,Simulator.getComponent(targetid),targetepid);
            //Simulator.disconnect(Simulator.getComponent(targetid),targetepid,Simulator.getComponent(sourceid),sourceepid);
        });
    });
});