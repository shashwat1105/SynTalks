import NewDm from "./components/new-dm";
import ProfileInfo from "./components/profile-info";

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] bg-[#1b1c24] border-r-2 border-[#2f303b] sm:w-full  xl:w-[20vw]">
       <div className="pt-3">

        <Logo/>
       </div>
        <div className="my-5">
            <div className="flex justify-between pr-10 items-center">
             <Title text="Direct Messages"/>
             <NewDm/>
            </div>
        
        </div>

        <div className="my-5">
            <div className="flex justify-between pr-10 items-center">
             <Title text="Channels"/>
            </div>
        
        </div>
        <ProfileInfo/>
        </div>

        
  )
}

export default ContactsContainer


export const Logo = () => {
    return (
      <div className="flex p-5  justify-start items-center gap-2">
        <svg
          id="logo-38"
          width="78"
          height="32"
          viewBox="0 0 78 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <path
            d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
            className="ccustom"
            fill="#8338ec"
          ></path>{" "}
          <path
            d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
            className="ccompli1"
            fill="#975aed"
          ></path>{" "}
          <path
            d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
            className="ccompli2"
            fill="#a16ee8"
          ></path>{" "}
        </svg>
        <span className="text-3xl font-semibold ">Syncronus</span>
      </div>
    );
  };
  
  
  const Title=({text})=>{
    return (
        <h6 className="upercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90">
            {text}
        </h6>
    )
  }