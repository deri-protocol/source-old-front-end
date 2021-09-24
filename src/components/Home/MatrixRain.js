import { useRef ,useEffect} from "react"
import './matrix-rain.less'
import moment from 'moment'

export default function MatrixRain({lang}){
  const canvasRef = useRef(null)
  
  useEffect(() => {
    var canvas = canvasRef.current,
    ctx = canvas.getContext('2d');

    // Setting the width and height of the canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = window.innerWidth;
    canvas.height = rect.height;

    // Setting up the letters
    var letters = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψω';
    var number =  '0101010101010101010101010101010101010101010101010'
    letters = (letters + number).split('');

    // Setting up the columns
    var fontsSizes = [24,18,14]
    var fontSize = fontsSizes[0],
        columns = canvas.width / fontSize;

    var styles = [{fontSize : 18,color : '#246CAD'},
                  {fontSize : 15,color : '#1F619E'},
                  {fontSize : 12,color : '#23598B'},
                  {fontSize : 9,color : '#174268'}]
    // Setting up the drops
    var drops = [];
    var dropsStyles = []
    var interval = 100
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
      dropsStyles[i] = styles[Math.floor(Math.random() * styles.length)]
    }

    // Setting up the draw function
    function draw() {
      ctx.fillStyle = 'rgba(13, 14, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < drops.length; i++) {
        var text = letters[Math.floor(Math.random() * letters.length)];
        var style = dropsStyles[i];
        ctx.font = style.fontSize + 'px arial'
        ctx.fillStyle = style.color
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .97) {
          drops[i] = 0;
          var next = styles[Math.floor(Math.random() * styles.length)]
          styles.splice(i,1,next)
          // interval = 150
        }
      }
    }

    // Loop the animation
    setInterval(draw, interval);
  }, [])
  return (
    <canvas ref={canvasRef}>
    </canvas>
  )
}