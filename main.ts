namespace SpriteKind {
    export const buy = SpriteKind.create()
    export const collider = SpriteKind.create()
    //  bh2
    export const upgrade_click = SpriteKind.create()
    //  /bh2
    //  gh2
    export const upgrade = SpriteKind.create()
}

//  /gh2
//  variables
let pizza_per_click = 1
let pizza_per_second = 0
let mouse_x = 0
let mouse_y = 0
let store_items = ["NEW TOPPINGS", "MORE OVENS", "MORE WAITERS", "MORE CHEFS", "MORE RESTAURANTS"]
//  bh4
//  /bh4
let starting_cost = [10, 100, 1000, 5000, 10000]
//  bh4
//  /bh4
let passive_increase_values = [1, 2, 5, 10, 20]
//  bh4
//  gh2
let upgrade_costs = [100, 500, 5000, 10000, 20000]
//  bh4
//  /bh4
//  /gh2
//  sprites
let pizza_button = sprites.create(assets.image`pizza`, SpriteKind.Player)
pizza_button.setPosition(143, 50)
let pizza_per_second_sprite = textsprite.create("" + pizza_per_second, 3, 1)
pizza_per_second_sprite.setBorder(2, 3)
pizza_per_second_sprite.y = 20
pizza_per_second_sprite.right = 162
//  bh2
let click_upgrade_button = sprites.create(assets.image`upgrade`, SpriteKind.upgrade_click)
click_upgrade_button.scale = 2
click_upgrade_button.setPosition(143, 80)
sprites.setDataNumber(click_upgrade_button, "cost", 100)
//  /bh2
//  setup
info.setScore(100000)
scene.setBackgroundColor(1)
//  bh2
function make_click_upgrade_cost_display() {
    if (sprites.readDataSprite(click_upgrade_button, "cost_display")) {
        sprites.readDataSprite(click_upgrade_button, "cost_display").destroy()
    }
    
    let cost = sprites.readDataNumber(click_upgrade_button, "cost")
    let click_upgrade_cost_display = textsprite.create("" + cost, 5, 2)
    click_upgrade_cost_display.setPosition(143, 100)
}

make_click_upgrade_cost_display()
//  /bh2
function make_quantity_display(button: Sprite): TextSprite {
    let quantity = sprites.readDataNumber(button, "quantity")
    let quantity_text = textsprite.create("" + quantity, 5, 2)
    quantity_text.y = button.y + 10
    quantity_text.left = 5
    return quantity_text
}

function make_cost_display(button: Sprite): TextSprite {
    let cost = sprites.readDataNumber(button, "cost")
    let cost_text = textsprite.create("" + cost, 5, 2)
    cost_text.y = button.y + 10
    cost_text.right = 80
    return cost_text
}

//  gh2
function setup_upgrade_price(button: Sprite): TextSprite {
    let cost = sprites.readDataNumber(button, "upgrade_cost")
    let upgrade_price = textsprite.create("" + cost, 5, 2)
    upgrade_price.setPosition(110, button.y + 10)
    return upgrade_price
}

function setup_upgrade_button(button: Sprite, upgrade_cost: number): Sprite {
    let upgrade_button = sprites.create(assets.image`upgrade`, SpriteKind.upgrade)
    upgrade_button.setPosition(110, button.y)
    sprites.setDataNumber(upgrade_button, "upgrade_cost", upgrade_cost)
    sprites.setDataSprite(upgrade_button, "shop_item", button)
    //  when we buy we need this to change the effectiveness
    sprites.setDataSprite(upgrade_button, "upgrade_cost_display", setup_upgrade_price(upgrade_button))
    return upgrade_button
}

//  /gh2
//  pps needs to be sum
function setup_buttons() {
    let buy_button: TextSprite;
    let upgrade_button: Sprite;
    let y = 10
    for (let i = 0; i < store_items.length; i++) {
        buy_button = textsprite.create(store_items[i], 5, 2)
        buy_button.setKind(SpriteKind.buy)
        buy_button.setFlag(SpriteFlag.Ghost, false)
        buy_button.y = y
        buy_button.left = 5
        sprites.setDataNumber(buy_button, "quantity", 0)
        sprites.setDataNumber(buy_button, "cost", starting_cost[i])
        sprites.setDataNumber(buy_button, "passive_increase_value", passive_increase_values[i])
        //  gh2
        upgrade_button = setup_upgrade_button(buy_button, upgrade_costs[i])
        //  /gh2
        sprites.setDataSprite(buy_button, "quantity_text", make_quantity_display(buy_button))
        sprites.setDataSprite(buy_button, "cost_text", make_cost_display(buy_button))
        y += 20
    }
}

setup_buttons()
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function reigster_input(x: number, y: number) {
    let collider = sprites.create(image.create(2, 2), SpriteKind.collider)
    collider.setPosition(x, y)
    collider.image.fill(1)
    collider.lifespan = 500
    collider.setFlag(SpriteFlag.Invisible, true)
})
//  bh3
function animate_click(collider: Sprite) {
    let pizza = sprites.create(assets.image`pizza`)
    pizza.scale = 0.25
    pizza.setPosition(collider.x + 5, collider.y)
    pizza.setVelocity(randint(-15, 15), -15)
    pizza.ay = 50
    pizza.lifespan = 1000
    let increase = textsprite.create("" + pizza_per_click, 0, 15)
    increase.setPosition(collider.x + randint(-8, 8), collider.y)
    increase.vy = -5
    increase.lifespan = 2000
}

//  /bh3
//  bh5
timer.background(function setup_mouse_over_loop() {
    game.onUpdate(function mouse_over_button() {
        let temp_collider = sprites.create(image.create(1, 1))
        temp_collider.image.fill(1)
        temp_collider.setPosition(mouse_x, mouse_y)
        if (temp_collider.overlapsWith(pizza_button)) {
            pizza_button.scale = 1.1
        } else {
            pizza_button.scale = 1
        }
        
        temp_collider.destroy()
    })
})
//  /bh5
sprites.onOverlap(SpriteKind.collider, SpriteKind.Player, function click_pizza(collider: Sprite, pizza: Sprite) {
    //  bh3
    animate_click(collider)
    //  /bh3
    info.changeScoreBy(pizza_per_click)
    collider.destroy()
})
sprites.onOverlap(SpriteKind.collider, SpriteKind.buy, function buy_more(collider: Sprite, button: Sprite) {
    
    let cost = sprites.readDataNumber(button, "cost")
    if (cost > info.score()) {
        music.buzzer.play()
    } else {
        music.baDing.play()
        info.changeScoreBy(-cost)
        sprites.changeDataNumberBy(button, "quantity", 1)
        sprites.readDataSprite(button, "quantity_text").destroy()
        sprites.setDataSprite(button, "quantity_text", make_quantity_display(button))
        sprites.changeDataNumberBy(button, "cost", Math.idiv(cost, 10) + 1)
        sprites.readDataSprite(button, "cost_text").destroy()
        sprites.setDataSprite(button, "cost_text", make_cost_display(button))
    }
    
    collider.destroy()
})
//  bh2
sprites.onOverlap(SpriteKind.collider, SpriteKind.upgrade_click, function upgrade_click(collider: Sprite, button: Sprite) {
    
    let cost = sprites.readDataNumber(button, "cost")
    if (cost > info.score()) {
        music.buzzer.play()
    } else {
        pizza_per_click *= 2
        sprites.setDataNumber(button, "cost", cost * 10)
        make_click_upgrade_cost_display()
        info.changeScoreBy(-cost)
    }
    
    collider.destroy()
})
//  /bh2
//  gh2
sprites.onOverlap(SpriteKind.collider, SpriteKind.upgrade, function buy_upgrade(collider: Sprite, button: Sprite) {
    let shop_item: Sprite;
    let passive_value: number;
    let cost = sprites.readDataNumber(button, "upgrade_cost")
    if (cost > info.score()) {
        music.buzzer.play()
    } else {
        shop_item = sprites.readDataSprite(button, "shop_item")
        passive_value = sprites.readDataNumber(shop_item, "passive_increase_value")
        sprites.changeDataNumberBy(shop_item, "passive_increase_value", passive_value)
        info.changeScoreBy(-cost)
    }
    
    collider.destroy()
})
//  /gh2
//  bh6
sprites.onOverlap(SpriteKind.collider, SpriteKind.Food, function collect_ice_cream(collider: Sprite, ice_cream: Sprite) {
    info.changeScoreBy((pizza_per_second + 1) * 120)
    ice_cream.setVelocity(0, 0)
    ice_cream.destroy(effects.hearts, 2000)
})
//  /bh6
browserEvents.onMouseMove(function mouse_move(x: number, y: number) {
    
    mouse_x = x
    mouse_y = y
})
game.onUpdateInterval(1000, function passive_loop() {
    let quantity: number;
    let value: number;
    
    pizza_per_second = 0
    for (let button of sprites.allOfKind(SpriteKind.buy)) {
        quantity = sprites.readDataNumber(button, "quantity")
        value = sprites.readDataNumber(button, "passive_increase_value")
        pizza_per_second += quantity * value
    }
    pizza_per_second_sprite.setText("" + pizza_per_second)
    pizza_per_second_sprite.right = 162
    info.changeScoreBy(pizza_per_second)
})
//  bh1
game.onUpdateInterval(2000, function falling_pizza() {
    let pizza: Sprite;
    let pizzas_to_spawn = Math.ceil(pizza_per_second / 1000)
    pizzas_to_spawn = Math.constrain(pizzas_to_spawn, 0, 50)
    for (let i = 0; i < pizzas_to_spawn; i++) {
        pizza = sprites.create(assets.image`pizza`, SpriteKind.Projectile)
        pizza.scale = 0.25
        pizza.bottom = 1
        pizza.x = randint(6, 154)
        pizza.z = -100
        pizza.vy = 5
        pizza.setFlag(SpriteFlag.AutoDestroy, true)
    }
})
//  /bh1
// bh6
function spawn_ice_cream() {
    let vx = randint(0, 1) * 100 - 50
    let vy = randint(0, 1) * 100 - 50
    let ice_cream = sprites.createProjectileFromSide(assets.image`ice cream`, vx, vy)
    ice_cream.setKind(SpriteKind.Food)
    ice_cream.z = 100
    timer.after(randint(45000, 75000), spawn_ice_cream)
}

timer.after(randint(45000, 75000), spawn_ice_cream)
