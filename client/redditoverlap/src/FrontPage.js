function FrontPage() {
    return (
        <div className=" flex justify-center">
          <div className="content-container bg-blue-300 min-h-screen w-3/4">
            <div className="header-container bg-yellow-300 h-1/6 flex justify-center items-center">
              <header className='text-6xl bg-red-200 w-full text-center '>Reddit Overlap Analysis</header>
            </div>

            <div className="input-container  bg-orange-400 h-1/6 w-full flex justify-center items-center ">
                <div className="ghost-and-input relative w-4/6 bg-yellow-600 ">
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-2xl text-gray-500'>r/</span>
                    <input className='rounded-2xl w-full h-12 text-2xl pl-10 pr-14'
                        type="text"
                        placeholder=''
                    />
                    <span className='absolute inset-y-0 right-0 flex items-center pr-2'>
                        <button className='rounded-full h-10 w-10 bg-green-400 '> Go</button>
                    </span>
                    

                </div>
                
            </div>
          </div>
        </div>
      );
}

export default FrontPage