// export default function Footer() {
//   return (
//     <footer className="px-8 py-5 bg-beige flex items-center justify-between font-body text-sm text-cocoa-soft">
//       <span>© Afsana&apos;s Kitchen · Dhaka Uddan, Mohammadpur</span>
//       <div className="flex gap-4">
//         <a
//           href="https://www.facebook.com/cookingkitchenbyafsana/"
//           target="_blank"
//         >
//           Facebook
//         </a>
//         <a
//           href="https://www.youtube.com/@cookingkitchenbyafsana8203"
//           target="_blank"
//         >
//           YouTube
//         </a>
//       </div>
//     </footer>
//   );
// }
export default function Footer() {
  return (
    <footer className="border-t border-cocoa-soft/15 bg-beige px-8 py-6 font-body text-sm text-cocoa-soft">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Copyright */}
        <div className="text-center sm:text-left">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-cocoa">
              Afsana&apos;s Kitchen
            </span>
          </p>
          <p className="mt-1 text-xs text-cocoa-soft/75">
            Homemade goodness · Dhaka Uddan, Mohammadpur
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5">
          <a
            href="https://www.facebook.com/cookingkitchenbyafsana/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-cocoa"
          >
            Facebook
          </a>

          <span className="h-4 w-px bg-cocoa-soft/20" />

          <a
            href="https://www.youtube.com/@cookingkitchenbyafsana8203"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-cocoa"
          >
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}
