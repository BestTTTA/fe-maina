

const PageLoading = () => {
  return (
    <div className="fixed inset-0">
    <div className="w-full h-full bg-sky-300 animate-pulse flex justify-center items-center">
        <p className="font-extrabold text-4xl text-sky-600">กำลังโหลด...</p>
    </div>
</div>
  )
}

export default PageLoading
