import {BsSunglasses} from  "react-icons/bs"
import {GiShoppingBag,GiSofa,GiConverseShoe} from "react-icons/gi"
import {MdLocalGroceryStore} from "react-icons/md"
import {BiSolidDog} from "react-icons/bi"
import {PiHamburgerFill} from "react-icons/pi"
import {FaCarrot} from "react-icons/fa"

export const carasouleData=[
    {
      image:"https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=600",
      title:"The Beauty of Sofas",
      link:"/products/?keyword=battery"
    },
    {
      image:"https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600",
      title:"Buy Grocery Now",
      link:"/products/?keyword=battery"
    },
    {
      image:"https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=600",
      title:"Summer Sales On Fire !",
      description:`It is not so much for its beauty that the forest makes a claim
      upon men&apos;s hearts, as for that subtle something, that
      quality of air that emanation from old trees, that so
      wonderfully changes and renews a weary spirit.`,
      link:"/products/?keyword=battery"
    },
  ]
  export  const catagoriesData=[
    {
      icons:<BsSunglasses size={42} color='white' />,
      text:"mens",
    },
    {
      icons:<GiShoppingBag size={42} color='white'/>,
      text:"womens"
    },
    {
      icons:<GiSofa size={42} color='white'/>,
      text:"furniture"
    },
    {
      icons:<MdLocalGroceryStore size={42} color='white'/>,
      text:"grocery"
    },
    {
      icons:<BiSolidDog size={42} color='white'/>,
      text:"pet Food"
    },
    {
      icons:<PiHamburgerFill size={42} color='white'/>,
      text:" food"
    },
    {
      icons:<GiConverseShoe size={42} color='white' />,
      text:"cloths"
    },
    {
        icons:<FaCarrot size={42} color='white' />,
        text:"vegetables"
      },
    
  ]

  