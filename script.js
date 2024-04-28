function smooth(){
    gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
el: document.querySelector("#main"),
smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#main", {
scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
},
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});
// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();
}
smooth();
let xp=0;
let health=100;
let gold=50;
let currentWeapon=0;
let fighting;
let monsterHealth;
let inventory= ["Stick"];
const button1=document.querySelector("#button1");
const button2=document.querySelector("#button2");
const button3=document.querySelector("#button3");
const text=document.querySelector("#text");
const xpText=document.querySelector("#xpText");
const healthText=document.querySelector("#healthText");
const goldText=document.querySelector("#goldText");
const monsterStats=document.querySelector("#monsterStats");
const monsterNameText=document.querySelector("#monsterName");
const monsterHealthText=document.querySelector("#monsterHealth");
const weapons=[
    {
      name:"stick",
      power:5
    },
    {
      name:"dagger",
      power:30
    },
    {
      name:"claw hammer",
      power:50
    },
    {
      name:"sword",
      power:100
    }
];
const monsters=[
  {
    name:"slime",
    level:2,
    health:15
  },
  {
    name:"fanged beast",
    level:8,
    health:60
  },
  {
    name:"DRAGON",
    level:20,
    health:300
  }
];
const locations = [
  {
    name:"Town Square",
    "button text":["Go to Store","Go to Cave","Fight Dragon"],
    "button function":[goStore, goCave, fightDragon],
    text : "You are in the Town square. You see a sign that says \"Store.\""
  },
  {
    name:"Store",
    "button text":["Buy 10 health (10 gold)","Buy weapon (30 gold)","Go to Town square"],
    "button function":[buyHealth, buyWeapon, goTown],
    text:"You entered the Store."
  },
  {
    name:"Cave",
    "button text": ["Fight Slime","Fight fanged beast","Go to Town square"],
    "button function":[fightSlime,fightBeast,goTown],
    text:"You entered the cave. You see some Monsters."
  },
  {
    name:"Fight",
    "button text": ["Attack","Dodge","Run"],
    "button function":[attack,dodge,goTown],
    text:"You are fighting a MONSTERRR."
  },
  {
    name:"kill Monster",
    "button text": ["Go to Town Square","Go to Town Square","Go to Town Square"],
    "button function":[goTown,goTown,goTown],
    text:'The MONSTERRR scream "Arg!" as it dies. You gain experiance points and find GolDDD.'
  },
  {
    name:"LOSE!",
    "button text": ["REPLAY?","REPLAY?","REPLAY?"],
    "button function":[restart,restart,restart],
    text:"You die. 💀"
  },
  {
    name:"You WIN!",
    "button text": ["REPLAY?","REPLAY?","REPLAY?"],
    "button function":[restart,restart,restart],
    text:"You defeat the DRAGON! YOU WIN THE GAME! 👏🎉🎉🎉"
  }
];
//                                                       Initializing                                                    Buttons
button1.onclick=goStore;
button2.onclick=goCave;
button3.onclick=fightDragon;

function update(locations){
  monsterStats.style.display="none";
  button1.innerText = locations["button text"][0];
  button2.innerText = locations["button text"][1];
  button3.innerText = locations["button text"][2];
  button1.onclick = locations["button function"][0];
  button2.onclick = locations["button function"][1];
  button3.onclick = locations["button function"][2];
  text.innerText = locations.text;
}

function goTown(){
  update(locations[0]);
}

function goStore(){
    update(locations[1]);
}
function goCave(){
  update(locations[2]);

}
function buyHealth(){
  if(gold>=10){
    gold-=10;
    health+=10;
    goldText.innerText=gold;
    healthText.innerText=health;
  }else{
    text.innerText="Gareeboo, You cannot buy Gold";
  }
  
}
function buyWeapon(){
  if(currentWeapon<weapons.length - 1){
  if(gold>=30){
    gold-=30;
    currentWeapon++;
    goldText.innerText=gold;
    let newWeapon=weapons[currentWeapon].name;
    text.innerText="Now you have a " + newWeapon + ".";
    inventory.push(newWeapon);
    text.innerText += " In your inventory you have: " + inventory;
  }else{
    text.innerText="Gareeboo, You cannot buy a weapon.";

  }}else{
    text.innerText="Ameeroo, You already have the strongest weapon.";
    button2.innerText="Sell weapon for 15 gold";
    button2.onClick=sellWeapon;
  }
}
function sellWeapon(){
  if(inventory.length>1){
    let currentWeapon=inventory.shift();
    text.innerText="You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  }else{
    text.innerText="Don't sell your only Weapon!";
  }
}
function fightSlime(){
  fighting=0;
  goFight();
}
function fightBeast(){
  fighting=1;
  goFight();
}
function fightDragon(){
  fighting=2;
  goFight();
}
function goFight(){
  update(locations[3]);
  monsterHealth=monsters[fighting].health;
  monsterStats.style.display="block";
  monsterNameText.innerText=monsters[fighting].name;
  monsterHealthText.innerText=monsterHealth

}
function attack(){
  text.innerText="The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= monsters[fighting].level;
  monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random()* xp) + 1;
  healthText.innerText=health;
  monsterHealthText.innerText=monsterHealth;
  if(health<=0){
    lose();
  }else if(monsterHealth<=0){
  fighting===2 ? winGame() : defeatMonster();
  }
}
function dodge(){
  text.innerText="You dodged the attack from the" + monsters[fighting].name + ".";
}
function lose(){
  update(locations[5]);
}
function winGame(){
  update(locations[6]);
}
function defeatMonster(){
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText=gold;
  xpText.innerText=xp;
  update(locations[4]);
}
function restart(){
  xp=0;
  health=100;
  let gold=50;
  currentWeapon=0;
  inventory= ["Stick"];
  goldText.innerText=gold;
  healthText.innerText=health;
  xpText.innerText=xp;
  goTown();
}