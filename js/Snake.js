const ipc = require('electron').ipcRenderer;

export default class Snake {
    constructor(scene) { 
      this.changeSpeed();
      // ipc.on('main-send-change-speed');
        //Thiet lap scene la man hinh chinh
        this.scene = scene;
        //Thoi gian di chuyen cuoi cung
        this.lastMoveTime = 0;
        //Thoi gian di chuyen deu 0.5s +1x or 0.5s+ 1y
        this.moveInterval = 100;
        //dinh nghia width va height cho con ran hinh vuong
        this.titleSize = 16;
        //Thiet lap huong vector con ran di chuyen khoi dau la di xuong
        this.direction = Phaser.Math.Vector2.DOWN;
        //Mang body chua bo phan cua con ran
        this.body = [];
        //Them con moi mau do hinh vuong dung ham rectangle de tao hinh vuong va set vi tri va cho phep quay vong (top ,left : margin la secene cua game width va height /2) (width , height) and color
        this.body.push(
            this.scene.add
            .rectangle(
               this.scene.game.config.width / 2 ,
               this.scene.game.config.height / 2, 
               this.titleSize, 
               this.titleSize, 
               0xff0000
            )
            .setOrigin(0)
        );
        //Them qua tao de con ran san moi bang cach tao rectangle mau xanh
        this.apple = this.scene.add.rectangle(0, 0, this.titleSize, this.titleSize, 0x00ff00).setOrigin(0);
        //Ham chinh vi tri cua qua tao
        this.positionApple();
        //Gan su kien di chuyen ban phim cho scene la con ran
        scene.input.keyboard.on('keydown', e => {
            //Lay su kien keydown khi ta su dung ban phim mui ten no se di chuyen theo ca huong
            this.keydown(e);
        });
    }

    changeSpeed() {
      let speed = 500;
      ipc.on('main-send-change-speed', function(event, arg){
          speed = arg;
          console.log(speed);
      });
      this.moveInterval = speed;
    }

    //Ham chinh vi tri apple 
    positionApple() {
        //Phuong thuc lam tron vi tri ngau nhien cua qua tao sap cho duong di cua con ran trung khop voi qua tao
        this.apple.x = Math.floor((Math.random() * this.scene.game.config.width) / this.titleSize) * this.titleSize;
        this.apple.y = Math.floor((Math.random() * this.scene.game.config.height) / this.titleSize) * this.titleSize;
    }

    //Su kien keydown
    keydown(event) {
      // console.log(event);
      switch (event.keyCode) {
        case 37: //arrow left
        //Thiet lap huong vector con ran di chuyen trai voi dieu kien dang sang trai thi khong the qua phai
        if (this.direction !== Phaser.Math.Vector2.RIGHT)
          this.direction = Phaser.Math.Vector2.LEFT;
        break;
      case 38: //arrow up
        //Thiet lap huong vector con ran di chuyen len voi dieu kien dang di len thi khong the di xuong
        if (this.direction !== Phaser.Math.Vector2.DOWN)
          this.direction = Phaser.Math.Vector2.UP;
        break;
      case 39: //arrow right
        //Thiet lap huong vector con ran di chuyen phai voi dieu kien dang sang phai thi khong the qua trai
        if (this.direction !== Phaser.Math.Vector2.LEFT)
          this.direction = Phaser.Math.Vector2.RIGHT;
        break;
      case 40: //arrow down
        //Thiet lap huong vector con ran di chuyen xuong
        if (this.direction !== Phaser.Math.Vector2.UP)
          this.direction = Phaser.Math.Vector2.DOWN;
        break;
      // case 65: //a thi tro lai game
      //   this.stop = false;
      //   break;
      case 32: //space thi stop game
        if (this.stop == true) {
          this.stop = false;
          break;
        }
        else {
          this.stop = true;
          break;
        }
    }
  }

    //Ham update
    update(time) {
      //Khi stop
      if (this.stop === true) return;
      //Khi thoi gian chay lon hon moveInterval thi goi ham move
      if(time >= this.lastMoveTime + this.moveInterval) {
          //Thoi gian se dc gan cho thoi gian cuoi
          this.lastMoveTime = time;
          // console.log(this.lastMoveTime)
          //Goi ham move
          this.move();
      }
    }
    //Ham di chuyen
    move() {

      //Gan 2 bien x va y di theo huong chi dinh nhan voi toc do va co the thay doi khi ta dung su kien keydown 
      let x = this.body[0].x + this.direction.x * this.titleSize;
      let y = this.body[0].y + this.direction.y * this.titleSize;
      
      if(this.apple.x === x && this.apple.y === y) {

        //Khi vi tri cua qua tao bang vi tri body 0 nghia la con ran an dc qua tao 
        //push them vao body cua ran va thay doi vi tri cua tao moi
        this.body.push(this.scene.add.rectangle(0, 0, this.titleSize,this.titleSize, 0xffffff).setOrigin(0));
        this.positionApple();
        // console.log(object);
        ipc.send('client-send-increase-soccer');
      }

    if (this.apple.x === x && this.apple.y === y) {
      //Khi vi tri cua qua tao bang vi tri body 0 nghia la con ran an dc qua tao 
      //push them vao body cua ran va thay doi vi tri cua tao moi
      this.body.push(this.scene.add.rectangle(0, 0, this.titleSize, this.titleSize, 0xffffff).setOrigin(0));
      this.positionApple();
    }

   


      //Neu do dai cua dau con ran be hon 0 hoac lon hon width cua MainScene thi lose va restart()
      if(this.body[0].x < 0 || //left
         this.body[0].x >= this.scene.game.config.width || //right
         this.body[0].y < 0 || //top
         this.body[0].y >= this.scene.game.config.height //bottom
      ) {
        ipc.send('client-send-resert');
        this.scene.scene.restart();
      }
      //Chet boi dam dau vao cai than cua con ran
      //Trich xuat tat ca phan tu tu vi tri thu 2 cua con ran nghia la ham nay bao gom con ran tru cai dau
      let tail = this.body.slice(1);
      //Ham some tuong tu thu filter voi dieu kien length > 0 
      //Neu dau con ran ma bang vi tri 1 phan tu o trong tail thi lose
      if(tail.some(s => s.x === this.body[0].x && s.y === this.body[0].y)) {
        ipc.send('client-send-resert');
         this.scene.scene.restart();
      }
      
      // console.log('body: ', this.body.length);
    }

    
}