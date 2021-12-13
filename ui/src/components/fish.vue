<template>
    <div id="container2">
        <div id="containerfish">
            <div id="background" style="overflow: hidden">
                <img src="../assets/TopDownScreenB.jpg" id="overlay" class="hideable" style="user-select:none;">
                <div id="textBox" class="hideable">
                    <span id="textOne" class="hideable" style="user-select:none;">That's a nice catch. Would you like to sell it?</span>
                    <span id="textTwo" class="hideable" style="user-select:none;">Great, my family will love this.</span>
                </div>
                <div id="fishAgain" class="button left-button hideable">
                    Fish again
                </div>
                <div id="throwBack" class="button left-button hideable">
                    Toss back
                </div>
                <div id="sellIt" class="button right-button hideable">
                    Sell
                </div>
                <img src="../assets/Mountain.png" id="mountain" style="user-select:none;">
                <img src="../assets/Water.png" id="water" style="user-select:none;"> 
                <div id="canvas">
                    <svg width="500" height="500" id="line"><line x1="0" y1="0" x2="0" y2="0" stroke="black" id="lineline"/></svg>
                </div>
                <div id="cliff-fisherman">
                    <img src="../assets/Fisherman1.png" id="fisherman" style="user-select:none;">	
                    <img src="../assets/Cliff.png" id="cliff"> 	
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import store from '@/store'
    import Matter from "matter-js";
    export default {
        name: 'Fish',
        components: {
        },
        methods: {
            submit(){

            },
            unfish() {
                this.stop = 1
                this.stopStory = 1
            },
            fish(){
                // state 0 = doing nothing 
                // state 1 = casted so sink line
                // state 2 = caught fish so real it in
                this.stop = 0
                let state = 0
                let events = 0
                let caststate = 0
                // let castline = 0
                let splash = false
                let forcepower = 15000
                let splashbodys = []
                let elements = []
                let fishstate = {"fish1": "left", "fish2": "left", "fish3": "right"}
                let oldfishstate = {"fish1": "left", "fish2": "left", "fish3": "right"}
                let storystate = 0
                if(document.getElementById("containerfish") == null){
                    return;
                }
                const container = document.getElementById("containerfish").parentNode // Element to contain the fish game
                const containerStyle = window.getComputedStyle(container, null)
                let vw = (container.clientWidth - containerStyle.getPropertyValue('padding-left').replace("px", "")) - containerStyle.getPropertyValue('padding-right').replace("px", "")
                let vh = (container.clientHeight - containerStyle.getPropertyValue('padding-top').replace("px", "")) - containerStyle.getPropertyValue('padding-bottom').replace("px", "")
                let size = Math.min(vw, vh)
                let sizep = size/100
                document.getElementById('containerfish').style.width = size+"px"
                document.getElementById('containerfish').style.height = size+"px"


                // module aliases
                var Engine = Matter.Engine,
                    Render = Matter.Render,
                    Runner = Matter.Runner,
                    // Composites = Matter.Composites,
                    MouseConstraint = Matter.MouseConstraint,
                    Mouse = Matter.Mouse,
                    Composite = Matter.Composite,
                    Constraint = Matter.Constraint,
                    Bodies = Matter.Bodies;

                // create an engine
                var engine = Engine.create();

                // create a renderer
                var render = Render.create({
                    element: document.getElementById('canvas'),
                    engine: engine,
                    options: {
                        width: size,
                        height: size,
                        background: "#fffffff",
                        wireframeBackground: "#fffffff",
                        wireframes: false,
                    }
                });


                let lineconstraint = ''
                let point = Bodies.circle(sizep*63.4, sizep*23.5, 1, { isStatic: true});

                const baitf = (id=2000, pos={}, stiffness=1) => {
                    let baitt = ''
                    switch (id) {
                        case 2000:
                            baitt = Bodies.rectangle(sizep*(63.4), sizep*(35), sizep*2.5, sizep*5, {id: 2000, "render": {"zIndex": 3, "sprite": {"texture": "../assets/Bait.png", xScale: size/939, yScale: size/939}}, frictionAir: 0.05});
                            Matter.Body.setStatic(baitt, true)
                            break
                        case 1001:
                            baitt = Bodies.rectangle(pos.x, pos.y, sizep*10, sizep*10, {id: 2000, "render": {"zIndex": 3, "sprite": {"texture": "../assets/Fish1B.png", xScale: size/939, yScale: size/939}}, frictionAir: 0.35});
                            break
                        case 2001:
                            baitt = Bodies.rectangle(pos.x, pos.y, sizep*10, sizep*10, {id: 2000, "render": {"zIndex": 3, "sprite": {"texture": "../assets/Fish2B.png", xScale: size/939, yScale: size/939}}, frictionAir: 0.35});
                            break
                        case 3001:
                            baitt = Bodies.rectangle(pos.x, pos.y, sizep*10, sizep*10, {id: 2000, "render": {"zIndex": 3, "sprite": {"texture": "../assets/Fish3.png", xScale: size/939, yScale: size/939}}, frictionAir: 0.35});
                            break
                    }
                    if (id == 2000){
                        lineconstraint = Constraint.create({bodyA: point, bodyB: baitt, pointB: {x: 0, y: -sizep*2.5}, stiffness: stiffness, type: "line", render:{visible: false}})
                    } else {
                        lineconstraint = Constraint.create({bodyA: point, bodyB: baitt, pointB: {x: +sizep*4.5, y: 0}, stiffness: stiffness, type: "line", render:{visible: false}})
                    }

                    return baitt
                }

                let fish1L = Bodies.rectangle(sizep*15, sizep*65, sizep*10, sizep*10, {id: 1001, isSensor: true, "render": {"sprite": {"texture": "../assets/Fish1.png", xScale: size/939, yScale: size/939}}});
                let fish2L = Bodies.rectangle(sizep*45, sizep*52.5, sizep*10, sizep*10, {id: 2001, isSensor: true, "render": {"sprite": {"texture": "../assets/Fish2.png", xScale: size/939, yScale: size/939}}});
                let fish3L = Bodies.rectangle(sizep*70, sizep*65, sizep*10, sizep*10, {id: 3001, isSensor: true, "render": {"sprite": {"texture": "../assets/Fish3B.png", xScale: size/939, yScale: size/939}}});
                // let fish1catchL = Bodies.rectangle(sizep*10, sizep*65, sizep*5, sizep*5, {id: 1001, isSensor: true, "render": {"visible": true}});
                // let fish2catchL = Bodies.rectangle(sizep*40, sizep*52.5, sizep*5, sizep*5, {id: 2001, isSensor: true, "render": {"visible": true}});
                // let fish3catchL = Bodies.rectangle(sizep*65, sizep*65, sizep*5, sizep*5, {id: 3001, isSensor: true, "render": {"visible": true}});
                // let fish1lineL = Constraint.create({bodyA: fish1L, bodyB: fish1catchL, stiffness: 1, type: "line", render:{visible: false}})
                // let fish2lineL = Constraint.create({bodyA: fish2L, bodyB: fish2catchL, stiffness: 1, type: "line", render:{visible: false}})
                // let fish3lineL = Constraint.create({bodyA: fish3L, bodyB: fish3catchL, stiffness: 1, type: "line", render:{visible: false}})
                let fish1R = Bodies.rectangle(sizep*15, sizep*65, sizep*10, sizep*10, {id: 1002, isSensor: true, "render": {"sprite": {"texture": "../assets/Fish1B.png", xScale: size/939, yScale: size/939}}});
                let fish2R = Bodies.rectangle(sizep*45, sizep*52.5, sizep*10, sizep*10, {id: 2002, isSensor: true, "render": {"sprite": {"texture": "../assets/Fish2B.png", xScale: size/939, yScale: size/939}}});
                let fish3R = Bodies.rectangle(sizep*70, sizep*65, sizep*10, sizep*10, {id: 3002, isSensor: true, "render": {"sprite": {"texture": "../assets/Fish3.png", xScale: size/939, yScale: size/939}}});
                // let fish1catchR = Bodies.rectangle(sizep*20, sizep*65, sizep*5, sizep*5, {id: 1002, isSensor: true, "render": {"visible": true}});
                // let fish2catchR = Bodies.rectangle(sizep*50, sizep*52.5, sizep*5, sizep*5, {id: 2002, isSensor: true, "render": {"visible": true}});
                // let fish3catchR = Bodies.rectangle(sizep*75, sizep*65, sizep*5, sizep*5, {id: 3002, isSensor: true, "render": {"visible": true}});
                // let fish1lineR = Constraint.create({bodyA: fish1R, bodyB: fish1catchR, stiffness: 1, type: "line", render:{visible: false}})
                // let fish2lineR = Constraint.create({bodyA: fish2R, bodyB: fish2catchR, stiffness: 1, type: "line", render:{visible: false}})
                // let fish3lineR = Constraint.create({bodyA: fish3R, bodyB: fish3catchR, stiffness: 1, type: "line", render:{visible: false}})
                let waterfloor = Bodies.rectangle(sizep*50, sizep*83, size, 10, {density: 1, isStatic: true, render: {visible: false}});
                let cliff = Bodies.rectangle(sizep*90, sizep*70, sizep*20, sizep*60, {density: 1, isStatic: true, render: {visible: false}});
                let water = Bodies.rectangle(sizep*50, sizep*64, size, sizep*40, {id: 1000, density: 1, isSensor: true, isStatic: true, render: {visible: false}});
                let bait = baitf()

                //id 1000 = water
                //id 2000 = bait
                Matter.Body.set(fish1R, "position", {x: -sizep*50, y: fish1R.position.y})
                Matter.Body.set(fish2R, "position", {x: -sizep*50, y: fish2R.position.y})
                Matter.Body.set(fish3L, "position", {x: -sizep*50, y: fish3L.position.y})



                //Make elements static
                Matter.Body.setStatic(cliff, true)
                Matter.Body.setStatic(fish1R, true)
                Matter.Body.setStatic(fish2R, true)
                Matter.Body.setStatic(fish3R, true)
                // Matter.Body.setStatic(fish1catchR, true)
                // Matter.Body.setStatic(fish2catchR, true)
                // Matter.Body.setStatic(fish3catchR, true)
                Matter.Body.setStatic(fish1L, true)
                Matter.Body.setStatic(fish2L, true)
                Matter.Body.setStatic(fish3L, true)
                // Matter.Body.setStatic(fish1catchL, true)
                // Matter.Body.setStatic(fish2catchL, true)
                // Matter.Body.setStatic(fish3catchL, true)

                // Set Constraints
                let mouse = Mouse.create(render.canvas),
                        mouseConstraint = MouseConstraint.create(engine, {
                            mouse: mouse,
                            constraint: {
                                stiffness: 0.2,
                                render: {
                                    visible: false
                                }
                            }
                        });

                elements.push(cliff)
                elements.push(water)
                elements.push(fish1L)
                elements.push(fish2L)
                // elements.push(fish1lineL)
                // elements.push(fish2lineL)
                // elements.push(fish1catchL)
                // elements.push(fish2catchL)
                elements.push(fish1R)
                elements.push(fish2R)
                // elements.push(fish1lineR)
                // elements.push(fish2lineR)
                // elements.push(fish1catchR)
                // elements.push(fish2catchR)
                elements.push(fish3R)
                // elements.push(fish3lineR)
                // elements.push(fish3catchR)
                elements.push(fish3L)
                // elements.push(fish3lineL)
                // elements.push(fish3catchL)
                elements.push(mouseConstraint)
                elements.push(waterfloor)
                elements.push(point)
                elements.push(bait)
                elements.push(lineconstraint)
                Composite.add(engine.world, elements);
                Render.run(render);
                var runner = Runner.create();
                Runner.run(runner, engine);

                let positionline = () => {
                    switch (caststate) {
                        case 0:
                            Matter.Body.set(point, "position", {x: sizep*63.4, y: sizep*23.5})
                            document.getElementById("lineline").x1.baseVal.value = sizep*63.4
                            document.getElementById("lineline").y1.baseVal.value = sizep*23.5
                            break
                        case 1:
                            Matter.Body.set(point, "position", {x: sizep*68.7, y: sizep*14.2})
                            document.getElementById("lineline").x1.baseVal.value = sizep*68.7
                            document.getElementById("lineline").y1.baseVal.value = sizep*14.2
                            break
                        case 2:
                            Matter.Body.set(point, "position", {x: sizep*74.4, y: sizep*8.5})
                            document.getElementById("lineline").x1.baseVal.value = sizep*74.4
                            document.getElementById("lineline").y1.baseVal.value = sizep*8.5
                            break
                        case 3:
                            Matter.Body.set(point, "position", {x: sizep*80.3, y: sizep*2.5})
                            document.getElementById("lineline").x1.baseVal.value = sizep*80.3
                            document.getElementById("lineline").y1.baseVal.value = sizep*2.5
                            break
                        case 4:
                            Matter.Body.set(point, "position", {x: sizep*90, y: sizep*0.7})
                            document.getElementById("lineline").x1.baseVal.value = sizep*90
                            document.getElementById("lineline").y1.baseVal.value = sizep*0.7
                            break
                    }
                    switch (state) {
                        case 0:
                            document.getElementById("lineline").y2.baseVal.value = bait.position.y - sizep*2.5
                            document.getElementById("lineline").x2.baseVal.value = bait.position.x
                            break
                        case 1:
                            document.getElementById("lineline").y2.baseVal.value = bait.position.y - sizep*2.5
                            document.getElementById("lineline").x2.baseVal.value = bait.position.x
                            break
                        case 2:
                            document.getElementById("lineline").y2.baseVal.value = (bait.position.y + lineconstraint.pointB.y)
                            document.getElementById("lineline").x2.baseVal.value = (bait.position.x + lineconstraint.pointB.x)
                            break
                        case 3:
                            document.getElementById("lineline").y2.baseVal.value = (bait.position.y + lineconstraint.pointB.y)
                            document.getElementById("lineline").x2.baseVal.value = (bait.position.x + lineconstraint.pointB.x)
                            break

                    }
                }

                let positionfish = () => {
                    if (oldfishstate.fish1 != fishstate.fish1) {
                        if (fishstate.fish1 == "left") {
                            Matter.Body.set(fish1R, "position", {x: -sizep*50, y: fish1R.position.y})
                            Matter.Body.set(fish1L, "position", {x: -sizep*50, y: fish1L.position.y})
                            Matter.Body.set(fish1L, "position", {x: sizep*25, y: fish1L.position.y})
                        } else if (fishstate.fish1 == "right") {
                            Matter.Body.set(fish1R, "position", {x: -sizep*50, y: fish1R.position.y})
                            Matter.Body.set(fish1L, "position", {x: -sizep*50, y: fish1L.position.y})
                            Matter.Body.set(fish1R, "position", {x: sizep*5, y: fish1R.position.y})
                        } else {
                            Matter.Body.set(fish1R, "position", {x: -sizep*50, y: fish1R.position.y})
                            Matter.Body.set(fish1L, "position", {x: -sizep*50, y: fish1L.position.y})
                        }
                    }
                    if (oldfishstate.fish2 != fishstate.fish2) {
                        if (fishstate.fish2 == "left") {
                            Matter.Body.set(fish2R, "position", {x: -sizep*50, y: fish2R.position.y})
                            Matter.Body.set(fish2L, "position", {x: -sizep*50, y: fish2L.position.y})
                            Matter.Body.set(fish2L, "position", {x: sizep*55, y: fish2L.position.y})
                        } else if (fishstate.fish2 == "right") {
                            Matter.Body.set(fish2R, "position", {x: -sizep*50, y: fish2R.position.y})
                            Matter.Body.set(fish2L, "position", {x: -sizep*50, y: fish2L.position.y})
                            Matter.Body.set(fish2R, "position", {x: sizep*35, y: fish2R.position.y})
                        } else {
                            Matter.Body.set(fish2R, "position", {x: -sizep*50, y: fish2R.position.y})
                            Matter.Body.set(fish2L, "position", {x: -sizep*50, y: fish2L.position.y})
                        }
                    }
                    if (oldfishstate.fish3 != fishstate.fish3) {
                        if (fishstate.fish3 == "left") {
                            Matter.Body.set(fish3R, "position", {x: -sizep*50, y: fish3R.position.y})
                            Matter.Body.set(fish3L, "position", {x: -sizep*50, y: fish3L.position.y})
                            Matter.Body.set(fish3L, "position", {x: sizep*80, y: fish3L.position.y})
                        } else if (fishstate.fish3 == "right") {
                            Matter.Body.set(fish3R, "position", {x: -sizep*50, y: fish3R.position.y})
                            Matter.Body.set(fish3L, "position", {x: -sizep*50, y: fish3L.position.y})
                            Matter.Body.set(fish3R, "position", {x: sizep*60, y: fish3R.position.y})
                        } else {
                            Matter.Body.set(fish3R, "position", {x: -sizep*50, y: fish3R.position.y})
                            Matter.Body.set(fish3L, "position", {x: -sizep*50, y: fish3L.position.y})
                        }
                    }
                    oldfishstate = JSON.parse(JSON.stringify(fishstate))
                }

                const movefish = () => {
                    if (fishstate.fish1 == "left") {
                        if (fish1L.position.x <= sizep*5) {
                            fishstate.fish1 = "right"
                        }
                        Matter.Body.set(fish1L, "position", {x: fish1L.position.x - 0.5, y: fish1L.position.y})
                    } else if (fishstate.fish1 == "right") {
                        if (fish1R.position.x >= sizep*25) {
                            fishstate.fish1 = "left"
                        }
                        Matter.Body.set(fish1R, "position", {x: fish1R.position.x + 0.5, y: fish1R.position.y})
                    }
                    if (fishstate.fish2 == "left") {
                        if (fish2L.position.x <= sizep*35) {
                            fishstate.fish2 = "right"
                        }
                        Matter.Body.set(fish2L, "position", {x: fish2L.position.x - 1, y: fish2L.position.y})
                    } else if (fishstate.fish2 == "right") {
                        if (fish2R.position.x >= sizep*55) {
                            fishstate.fish2 = "left"
                        }
                        Matter.Body.set(fish2R, "position", {x: fish2R.position.x + 1, y: fish2R.position.y})
                    }
                    if (fishstate.fish3 == "left") {
                        if (fish3L.position.x <= sizep*60) {
                            fishstate.fish3 = "right"
                        }
                        Matter.Body.set(fish3L, "position", {x: fish3L.position.x - 1, y: fish3L.position.y})
                    } else if (fishstate.fish3 == "right") {
                        if (fish3R.position.x >= sizep*80) {
                            fishstate.fish3 = "left"
                        }
                        Matter.Body.set(fish3R, "position", {x: fish3R.position.x + 1, y: fish3R.position.y})
                    }
                }


                // const runningfish = () => {
                //  if (state == 2) {
                //      argetAngle = Matter.Vector.angle(bait.position, point.position);
                //      let force = -((size / forcepower)/2)
                //      const vector =  {
                //        x: (Math.cos(targetAngle) * force) * bait.mass, 
                //        y: (Math.sin(targetAngle) * force) * bait.mass
                //      }
                //      Matter.Body.applyForce(bait, bait.position, vector);
                //  }
                //  setTimeout(()=>{runningfish()},100)
                // }

                let animate = () => {
                    if (this.stop) return
                    positionline()
                    positionfish()
                    movefish()
                    // runningfish()
                    switch (caststate){
                        case 0:
                            document.getElementById('fisherman').src = "../assets/Fisherman1.png"
                            break
                        case 1:
                            document.getElementById('fisherman').src = "../assets/Fisherman2.png"
                            break
                        case 2:
                            document.getElementById('fisherman').src = "../assets/Fisherman3.png"
                            break
                        case 3:
                            document.getElementById('fisherman').src = "../assets/Fisherman4.png"
                            break
                        case 4:
                            document.getElementById('fisherman').src = "../assets/Fisherman5.png"
                            break
                    }
                    if (splash) {
                        let splashbody = Bodies.rectangle(bait.position.x, sizep*37.5, sizep*2.5, sizep*5, {id: 333, isStatic: true, isSensor: true, "render": {"zIndex": 3, "sprite": {"texture": "../assets/WaterSplash.png", xScale: size/939, yScale: size/939}}, frictionAir: 0.1});
                        splashbodys.push(splashbody)
                        Composite.add(engine.world, splashbody);
                        setTimeout(() => {Composite.remove(engine.world, splashbodys)}, 500);
                        splash = false
                    }
                    switch (state) {
                        case 0: 
                            Matter.Body.set(bait, "angle", 0);
                            break
                        case 1:
                            Matter.Body.set(bait, "angle", 0);
                            break
                        case 2:
                            Matter.Body.set(bait, "angle", Matter.Vector.angle(bait.position, point.position));
                            break
                        case 3:
                            Matter.Body.set(bait, "angle", Matter.Vector.angle(bait.position, point.position));
                            break
                    }
                    setTimeout(()=>{animate()}, 50)
                }

                let tug = () => {
                    caststate = 1
                    let targetAngle = Matter.Vector.angle(bait.position, point.position);
                    let force = size / forcepower 
                    const vector =  {
                    x: (Math.cos(targetAngle) * force) * bait.mass, 
                    y: (Math.sin(targetAngle) * force) * bait.mass
                    }
                    Matter.Body.applyForce(bait, bait.position, vector);
                    setTimeout(()=>{caststate=0},100)
                }

                let cast = () => {
                    state = 1
                    caststate = 4; 
                    Matter.Body.setStatic(bait, false)
                    setTimeout(()=>{caststate = 4}, 100)
                    setTimeout(()=>{caststate = 3}, 150)
                    setTimeout(()=>{caststate = 1}, 250)
                    setTimeout(()=>{caststate = 0}, 300)
                    setTimeout(()=>{
                        Composite.remove(engine.world, bait);
                        Composite.remove(engine.world, lineconstraint);
                        bait = baitf(2000, {}, 0.000000001)
                        Matter.Body.setStatic(bait, false)
                        Composite.add(engine.world, bait);
                        Composite.add(engine.world, lineconstraint);
                        let targetAngle = Matter.Vector.angle(bait.position, {x: sizep*20, y: sizep*20});
                        let force = size / 9000
                        const vector =  {
                        x: (Math.cos(targetAngle) * force) * bait.mass, 
                        y: (Math.sin(targetAngle) * force) * bait.mass
                        }
                        Matter.Body.applyForce(bait, bait.position, vector);
                    },350)
                }

                animate()

                const catchfish = (id) => {
                    state = 2
                    const pos = bait.position
                    Composite.remove(engine.world, lineconstraint);
                    Composite.remove(engine.world, bait);
                    bait = baitf(id, pos, 0.000000001)
                    Composite.add(engine.world, bait);
                    Composite.add(engine.world, lineconstraint);
                }

                const reset = () => {
                    Composite.remove(engine.world, lineconstraint);
                    Composite.remove(engine.world, bait);
                    bait = baitf()
                    bait.frictionAir = 0.1
                    forcepower = 15000
                    Composite.add(engine.world, bait);
                    Composite.add(engine.world, lineconstraint);
                    fishstate = {"fish1": "left", "fish2": "left", "fish3": "right"}
                    document.getElementById("overlay").style.display = 'none'
                    Array.from(document.getElementsByClassName("hideable")).forEach(hideable => hideable.style.display = "none")
                    storystate = 0
                    state = 0
                }

                document.getElementById("throwBack").addEventListener('click', () => {
                    setTimeout(()=>{reset()}, 80)
                });
                document.getElementById("throwBack").addEventListener('touchstart', () => {
                    setTimeout(()=>{reset()}, 80)
                });

                document.getElementById("fishAgain").addEventListener('click', () => {
                    setTimeout(()=>{reset()}, 80)
                });
                document.getElementById("fishAgain").addEventListener('touchstart', () => {
                    setTimeout(()=>{reset()}, 80)
                });

                document.getElementById("sellIt").addEventListener('click', () => {
                    storystate = 1
                    advanceStory()
                });
                document.getElementById("sellIt").addEventListener('touchstart', () => {
                    storystate = 1
                    advanceStory()
                });

                const advanceStory = () => {
                    console.log(!this.stopStory)
                    if (!this.stopStory && document.getElementById("overlay")) {
                        Array.from(document.getElementsByClassName("hideable")).forEach(hideable => hideable.style.display = "none")
                        document.getElementById("overlay").style.display = "block"
                        document.getElementById("textBox").style.display = 'block'
                        switch (storystate) {
                            case 0:
                                document.getElementById("textOne").style.display = 'block'
                                document.getElementById("throwBack").style.display = 'block'
                                document.getElementById("sellIt").style.display = 'block'
                                break
                            case 1: 
                                document.getElementById("textTwo").style.display = 'block'
                                document.getElementById("fishAgain").style.display = 'block'
                        }
                    }
                    
                }


                window.addEventListener('keydown', () => {
                    if (state == 0 && events) {
                        cast()  
                    } else if (state == 1 || state == 2) {
                        tug()
                    }
                    events = 1 
                });

                window.addEventListener('click', () => {
                    if (state == 0 && events) {
                        cast()  
                    } else if (state == 1 || state == 2) {
                        tug()
                    }
                    events = 1
                });

                window.addEventListener('touchstart', () => {
                    if (state == 0 && events) {
                        cast()  
                    } else if (state == 1 || state == 2) {
                        tug()
                    }
                    events = 1
                });

                Matter.Events.on(engine, 'collisionActive', function(event) {
                    var pairs = event.pairs;
                    for (var i = 0, j = pairs.length; i != j; ++i) {
                        var pair = pairs[i];
                        if ((pair.bodyA.id == 1000 || pair.bodyA.id == 2000) && (pair.bodyB.id == 1000 || pair.bodyB.id == 2000) && state != 3) {
                            bait.frictionAir = 0.45
                            forcepower = 4333
                        }

                    }
                });
                Matter.Events.on(engine, 'collisionStart', function(event) {
                    var pairs = event.pairs;
                    for (var i = 0, j = pairs.length; i != j; ++i) {
                        var pair = pairs[i];
                        if ((pair.bodyA.id == 1000 || pair.bodyA.id == 2000) && (pair.bodyB.id == 1000 || pair.bodyB.id == 2000)) {
                            splash = true
                        }
                        if ((pair.bodyA.id == 2000 || pair.bodyA.id == 1001 || pair.bodyA.id == 1002) && (pair.bodyB.id == 2000 || pair.bodyB.id == 1001 || pair.bodyB.id == 1002) && state == 1) {
                            fishstate.fish1 = "none"
                            catchfish(1001)
                        }
                        if ((pair.bodyA.id == 2000 || pair.bodyA.id == 2001 || pair.bodyA.id == 2002) && (pair.bodyB.id == 2000 || pair.bodyB.id == 2001 || pair.bodyB.id == 2002) && state == 1) {
                            fishstate.fish2 = "none"
                            catchfish(2001)
                        }
                        if ((pair.bodyA.id == 2000 || pair.bodyA.id == 3001 || pair.bodyA.id == 3002) && (pair.bodyB.id == 2000 || pair.bodyB.id == 3001 || pair.bodyB.id == 3002) && state == 1) {
                            fishstate.fish3 = "none"
                            catchfish(3001)
                        }

                    }
                });
                Matter.Events.on(engine, 'collisionEnd', function(event) {
                    var pairs = event.pairs;
                    for (var i = 0, j = pairs.length; i != j; ++i) {
                        var pair = pairs[i];
                        if ((pair.bodyA.id == 1000 || pair.bodyA.id == 2000) && (pair.bodyB.id == 1000 || pair.bodyB.id == 2000)) {
                            if (state == 2) {
                                state = 3
                                this.stopStory = 0
                                lineconstraint.length = sizep*9
                                lineconstraint.stiffness = 1
                                setTimeout(()=>{advanceStory()}, 1000)
                            } else {
                                reset()
                            }
                            if (state != 0){
                                splash = true   
                            }
                            bait.frictionAir = 0.1
                            forcepower = 15000
                        }
                    }
                });
            }

        },
        setup(){
            return { 
            }
        },
        data(){
            return { 
                bank: store.state.bank,
                stopStory: 0,
                stop: 0
            }
        },
        beforeUnmount(){
            //this.unfish()
        },
        mounted(){
            //this.fish()
        }
    }
</script>
<style>
  @import '../css/progress.css';
  @import '../css/fish.css';
</style>