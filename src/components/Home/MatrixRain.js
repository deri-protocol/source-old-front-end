import { useRef ,useState,useEffect} from "react"
import './matrix-rain.less'
import moment from 'moment'

export default function MatrixRain(){
  const canvasRef = useRef(null)
  const [size, setSize] = useState({width : window.innerWidth,height : window.innerHeight})

  useEffect(() => {
    const onResize = () => {
      setSize({width : window.innerWidth,height : window.innerHeight});
    }
    window.addEventListener("resize", onResize);
    return () => {
        window.removeEventListener("resize", onResize);
    }
  },[]);
  
  useEffect(() => {
    var canvas = canvasRef.current,
    ctx = canvas.getContext('2d');
    canvas.width = size.width;
    canvas.height = size.height;
    var letters = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψω';
    var number =  '0101010101010101010101010101010101010101010101010'
    letters = (letters + number).split('');

    // Setting up the columns
    var fontsSizes = [24,18,14]
    var fontSize = fontsSizes[0],
        columns = canvas.width / fontSize;

    var styles = [{fontSize : 18,color : '#246CFF'},
                  {fontSize : 18,color : '#00659f'},
                  {fontSize : 15,color : '#1F619E'},
                  {fontSize : 12,color : '#23598B'}]
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
        }
      }
    }

    // Loop the animation
    const inte = setInterval(draw, interval);
    return () => clearInterval(inte)
  }, [size.width,size.height])
  return (
    <canvas ref={canvasRef}>
    </canvas>
  )
}