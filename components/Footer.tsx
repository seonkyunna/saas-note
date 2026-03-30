import Link from "next/link";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e7eb] bg-white py-10 dark:border-gray-800 dark:bg-background-dark shrink-0">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
        <div className="flex items-center gap-2 text-[#9ca3af] dark:text-gray-500">
          <Icon name="cloud" className="text-[24px]" />
          <span className="text-sm">© CloudNote Inc. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link className="text-sm font-medium text-[#9ca3af] hover:text-primary transition-colors dark:text-gray-500" href="#">이용약관</Link>
          <Link className="text-sm font-medium text-[#9ca3af] hover:text-primary transition-colors dark:text-gray-500" href="#">개인정보처리방침</Link>
          <Link className="text-sm font-medium text-[#9ca3af] hover:text-primary transition-colors dark:text-gray-500" href="#">문의하기</Link>
        </div>
      </div>
    </footer>
  );
}
