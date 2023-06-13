import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineDownload,
  AiOutlineLeft,
  AiOutlineMail,
  AiOutlineRight,
} from "react-icons/ai";
import {
  BiBriefcase,
  BiBuildings,
  BiCalendarEvent,
  BiCurrentLocation,
  BiInfoCircle,
  BiMinusCircle,
  BiSearchAlt2,
  BiWater,
} from "react-icons/bi";
import { BsLayersHalf } from "react-icons/bs";
import { CgMathMinus, CgMathPlus } from "react-icons/cg";
import { FaSignature } from "react-icons/fa";
import { FiClock, FiDownload, FiPhone, FiUser, FiUsers } from "react-icons/fi";
import { GoLocation } from "react-icons/go";
import { HiOutlineDotsVertical, HiOutlineLocationMarker } from "react-icons/hi";
import { IoMdCalendar } from "react-icons/io";
import {
  IoCloseOutline,
  IoLocationSharp,
  IoTrashOutline,
} from "react-icons/io5";
import {
  MdArrowBack,
  MdEmail,
  MdExitToApp,
  MdKeyboardArrowDown,
  MdKeyboardBackspace,
  MdList,
  MdOutlineFullscreen,
  MdOutlineFullscreenExit,
  MdOutlineInsertPhoto,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdTune,
  MdViewModule,
} from "react-icons/md";
import { RiMap2Fill, RiTempColdLine } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";
import { VscVerified } from "react-icons/vsc";

import { FaExclamation } from "react-icons/fa";
export interface IconProps {
  name: string;
  className?: string;
  fun?: () => void;
}

const Icon = ({ name, className }: IconProps) => {
  switch (name) {
    case "temp":
      return <RiTempColdLine className={className} />;
    case "layer":
      return <BsLayersHalf className={className} />;
    case "location":
      return <HiOutlineLocationMarker className={className} />;
    case "date":
      return <BiCalendarEvent className={className} />;
    case "info":
      return <BiInfoCircle className={className} />;
    case "water":
      return <BiWater className={className} />;
    case "verified":
      return <VscVerified className={className} />;
    case "plus":
      return <CgMathPlus className={className} />;
    case "minus":
      return <CgMathMinus className={className} />;
    case "search":
      return <BiSearchAlt2 className={className} />;
    case "Searchlocation":
      return <GoLocation className={className} />;
    case "MapLocation":
      return <IoLocationSharp className={className} />;
    case "filter":
      return <MdTune className={className} />;
    case "delete":
      return <BiMinusCircle className={className} />;
    case "calendar":
      return <IoMdCalendar className={className} />;
    case "arrowDown":
      return <AiFillCaretDown className={className} />;
    case "arrowUp":
      return <AiFillCaretUp className={className} />;
    case "close":
      return <IoCloseOutline className={className} />;
    case "map":
      return <RiMap2Fill className={className} />;
    case "visibleOn":
      return <MdOutlineVisibility className={className} />;
    case "visibleOff":
      return <MdOutlineVisibilityOff className={className} />;
    case "fullscreen":
      return <MdOutlineFullscreen className={className} />;
    case "exitFullScreen":
      return <MdOutlineFullscreenExit className={className} />;
    case "current":
      return <BiCurrentLocation className={className} />;
    case "leftArrow":
      return <AiOutlineLeft className={className} />;
    case "rightArrow":
      return <AiOutlineRight className={className} />;
    case "photo":
      return <MdOutlineInsertPhoto className={className} />;
    case "back":
      return <MdKeyboardBackspace className={className} />;
    case "backMobile":
      return <MdArrowBack className={className} />;
    case "phone":
      return <FiPhone className={className} />;
    case "email":
      return <MdEmail className={className} />;
    case "user":
      return <FiUser className={className} />;
    case "users":
      return <FiUsers className={className} />;
    case "modules":
      return <MdViewModule className={className} />;
    case "time":
      return <FiClock className={className} />;
    case "exit":
      return <MdExitToApp className={className} />;
    case "company":
      return <BiBriefcase className={className} />;
    case "userEmail":
      return <AiOutlineMail className={className} />;
    case "list":
      return <MdList className={className} />;
    case "export":
      return <AiOutlineDownload className={className} />;
    case "menu":
      return <TiThMenu className={className} />;
    case "exclamation":
      return <FaExclamation className={className} />;
    case "building":
      return <BiBuildings className={className} />;
    case "dots":
      return <HiOutlineDotsVertical className={className} />;
    case "trashcan":
      return <IoTrashOutline className={className} />;
    case "sign":
      return <FaSignature className={className} />;
    case "dropdownArrow":
      return <MdKeyboardArrowDown className={className} />;
    case "download":
      return <FiDownload className={className} />;
    default:
      return null;
  }
};

export default Icon;
