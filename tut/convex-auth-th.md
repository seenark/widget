# บทสอนการยืนยันตัวตนด้วย Convex

## ภาพรวม

บทสอนนี้จะแนะนำคุณในการสร้างระบบยืนยันตัวตนในเว็บแอปพลิเคชันสมัยใหม่โดยใช้ **Convex** เป็นแบ็กเอนด์และ **TanStack Start** สำหรับฟรอนต์เอนด์ เราจะสร้างระบบยืนยันตัวตนที่สมบูรณ์พร้อมฟังก์ชันการล็อกอิน ลงทะเบียน และป้องกันการเข้าถึงเส้นทางต่างๆ

### สิ่งที่เราจะสร้าง

- ระบบยืนยันตัวตนแบบครบวงจรด้วยอีเมล/รหัสผ่าน
- ฟังก์ชันการลงทะเบียนและล็อกอินผู้ใช้
- เส้นทางที่ป้องกันการเข้าถึงซึ่งต้องการการยืนยันตัวตน
- การจัดการผู้ใช้กับฐานข้อมูล Convex
- UI สมัยใหม่ด้วยการจัดแต่งทรงผมด้วย Tailwind CSS

### ทำไมต้องใช้ Convex?

Convex เป็นแบ็กเอนด์แบบบริการ-as-a-service ที่ทรงพลังซึ่งให้บริการ:
- **ฐานข้อมูลแบบเรียลไทม์** พร้อมการซิงโครไนซ์อัตโนมัติ
- **ฟังก์ชันเซิร์ฟเวอร์** สำหรับตรรกะแบ็กเอนด์ที่ปลอดภัย
- **การยืนยันตัวตนในตัว** พร้อมผู้ให้บริการหลายราย
- **ความปลอดภัยของประเภท** จากฐานข้อมูลถึงฟรอนต์เอนด์
- **การสร้าง API อัตโนมัติ** - ไม่ต้องการ REST API

## ข้อกำหนดเบื้องต้น

ก่อนเริ่ม ให้แน่ใจว่าคุณมี:

- **Node.js** (เวอร์ชัน 18 ขึ้นไป)
- **npm** หรือ **bun** (เราจะใช้ bun ในบทสอนนี้)
- **Git** สำหรับการควบคุมเวอร์ชัน
- **VS Code** หรือโปรแกรมแก้ไขโค้ดที่คุณชื่นชอบ
- **บัญชี Convex** (ฟรีที่ [convex.dev](https://convex.dev))

## การตั้งค่าโปรเจกต์

### 1. โคลนและตั้งค่าโปรเจกต์

```bash
# โคลน repository
git clone <your-repo-url>
cd saas-widget

# สลับไปยัง branch convex-auth2
git checkout convex-auth2

# ติดตั้ง dependencies
bun install
```

### 2. การตั้งค่าสภาพแวดล้อม

สร้างตัวแปรสภาพแวดล้อมสำหรับทั้งแบ็กเอนด์และฟรอนต์เอนด์:

#### สภาพแวดล้อมแบ็กเอนด์ (.env.local)

สร้าง `packages/backend/.env.local`:

```env
# การกำหนดค่า Convex
CONVEX_DEPLOYMENT=dev
CONVEX_SITE_URL=http://localhost:3000
```

**ทำไมต้องใช้ตัวแปรเหล่านี้?**
- `CONVEX_DEPLOYMENT=dev`: บอก Convex ว่าเราอยู่ในโหมดพัฒนา
- `CONVEX_SITE_URL`: URL ที่ฟรอนต์เอนด์ของคุณจะทำงาน (จำเป็นสำหรับการเปลี่ยนเส้นทาง OAuth)

#### สภาพแวดล้อมฟรอนต์เอนด์ (.env.local)

สร้าง `apps/web/.env.local`:

```env
# การเชื่อมต่อ Convex
VITE_CONVEX_URL=http://localhost:3210
```

**ทำไมต้องใช้ตัวแปรนี้?**
- `VITE_CONVEX_URL`: ชี้ไปยังเซิร์ฟเวอร์แบ็กเอนด์ Convex ในเครื่อง
- คำนำหน้า `VITE_` จำเป็นสำหรับ Vite ในการเปิดเผยตัวแปรให้ฟรอนต์เอนด์

### 3. เริ่มต้นเซิร์ฟเวอร์พัฒนา

```bash
# เทอร์มินัล 1: เริ่มต้นแบ็กเอนด์ Convex
cd packages/backend
bun run dev

# เทอร์มินัล 2: เริ่มต้นฟรอนต์เอนด์เว็บ
cd apps/web
bun run dev
```

คุณควรเห็น:
- แบ็กเอนด์ Convex ทำงานที่ `http://localhost:3210`
- ฟรอนต์เอนด์เว็บทำงานที่ `http://localhost:3000`

## การทำความเข้าใจสถาปัตยกรรม

### โครงสร้างโปรเจกต์

```
saas-widget/
├── apps/
│   └── web/                 # ฟรอนต์เอนด์ TanStack Start
│       ├── src/
│       │   ├── components/  # คอมโพเนนต์ React
│       │   ├── lib/        # ฟังก์ชันยูทิลิตี้
│       │   └── routes/     # การกำหนดเส้นทางแบบไฟล์
│       └── .env.local      # ตัวแปรสภาพแวดล้อมฟรอนต์เอนด์
└── packages/
    └── backend/            # แบ็กเอนด์ Convex
        ├── convex/
        │   ├── auth.ts     # การกำหนดค่าการยืนยันตัวตน
        │   ├── schema.ts   # สคีมาฐานข้อมูล
        │   └── users.ts    # ฟังก์ชันที่เกี่ยวข้องกับผู้ใช้
        └── .env.local      # ตัวแปรสภาพแวดล้อมแบ็กเอนด์
```

### วิธีการทำงานของการยืนยันตัวตน

1. **ฟรอนต์เอนด์**: ผู้ใช้ป้อนอีเมล/รหัสผ่านในฟอร์มล็อกอิน
2. **Convex Auth**: ตรวจสอบข้อมูลประจำตัวและสร้างเซสชัน
3. **ฐานข้อมูล**: เก็บข้อมูลผู้ใช้อย่างปลอดภัย
4. **ฟรอนต์เอนด์**: รับสถานะการยืนยันตัวตนและอัปเดต UI

## การนำไปใช้งานทีละขั้นตอน

### ขั้นตอนที่ 1: การตั้งค่าการยืนยันตัวตนแบ็กเอนด์

#### สคีมา Convex (`packages/backend/convex/schema.ts`)

```typescript
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // รวมตาราง auth ในตัว (users, sessions, etc.)
  ...authTables,
  
  // ตารางข้อมูลผู้ใช้แบบกำหนดเอง
  my_users: defineTable({
    name: v.string(),
  }),
});
```

**ทำไมต้องใช้โครงสร้างนี้?**
- `authTables`: ให้ตารางที่สร้างไว้ล่วงหน้าสำหรับการยืนยันตัวตน (users, sessions, accounts)
- `my_users`: ตารางแบบกำหนดเองสำหรับข้อมูลผู้ใช้เพิ่มเติมนอกเหนือจากที่ auth ให้
- การใช้ `v.string()` ทำให้มั่นใจในความปลอดภัยของประเภทสำหรับฟิลด์ชื่อ

#### การกำหนดค่าการยืนยันตัวตน (`packages/backend/convex/auth.ts`)

```typescript
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      validatePasswordRequirements: () => {},
    }),
  ],
});
```

**ทำไมต้องใช้การตั้งค่านี้?**
- `Password provider`: เปิดใช้งานการยืนยันตัวตนด้วยอีเมล/รหัสผ่าน
- `validatePasswordRequirements`: ฟังก์ชันว่างหมายความว่าเรายอมรับรหัสผ่านใดๆ (ปรับแต่งตามต้องการ)
- `convexAuth`: สร้างฟังก์ชันการยืนยันตัวตนทั้งหมดที่เราจะใช้

#### การกำหนดค่า Auth Provider (`packages/backend/convex/auth.config.ts`)

```typescript
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
```

**ทำไมต้องใช้การกำหนดค่านี้?**
- บอก Convex ว่าฟรอนต์เอนด์ของเราอยู่ที่ไหน
- `applicationID: "convex"` ระบุว่านี่เป็นแอปพลิเคชัน auth ของ Convex

### ขั้นตอนที่ 2: ฟังก์ชันการจัดการผู้ใช้

#### ฟังก์ชันผู้ใช้ (`packages/backend/convex/users.ts`)

```typescript
import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

// ดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับการสาธิต)
export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// เพิ่มผู้ใช้ใหม่ (ป้องกัน)
export const add = mutation({
  args: {},
  handler: async (ctx) => {
    // ตรวจสอบว่าผู้ใช้ได้รับการยืนยันตัวตนแล้ว
    const userIdentity = await ctx.auth.getUserIdentity();
    if (userIdentity === null) {
      throw new ConvexError({
        data: {
          message: "Not Authenticated",
        },
      });
    }

    // เพิ่มผู้ใช้ไปยังตารางแบบกำหนดเองของเรา
    const userId = await ctx.db.insert("users", { name: "HadesGod" });
    return userId;
  },
});
```

**ทำไมต้องใช้แนวทางนี้?**
- `getMany`: คิวรีสาธารณะเพื่อดึงข้อมูลผู้ใช้ (สำหรับการสาธิต)
- `add`: การเปลี่ยนแปลงที่ป้องกันซึ่งต้องการการยืนยันตัวตน
- `ctx.auth.getUserIdentity()`: วิธีของ Convex ในการรับผู้ใช้ปัจจุบัน
- `ConvexError`: ให้การจัดการข้อผิดพลาดที่มีโครงสร้าง

### ขั้นตอนที่ 3: การตั้งค่าการยืนยันตัวตนฟรอนต์เอนด์

#### Convex Provider (`apps/web/src/lib/ConvexAuthClientProvider.tsx`)

```typescript
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export function ConvexAuthClientProvider({ children }: PropsWithChildren) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
```

**ทำไมต้องใช้ provider นี้?**
- เชื่อมต่อฟรอนต์เอนด์ของเรากับแบ็กเอนด์ Convex
- ให้บริบบการยืนยันตัวตนแก่แอปทั้งหมด
- ใช้ตัวแปรสภาพแวดล้อมสำหรับ URL ของ Convex

#### การผสานรวม Root Layout (`apps/web/src/routes/__root.tsx`)

เส้นทางรูทมีการตั้งค่า provider แล้วผ่านโครงสร้างแอป `ConvexAuthClientProvider` ครอบแอปพลิเคชันทั้งหมด ทำให้ auth พร้อมใช้งานทุกที่

### ขั้นตอนที่ 4: UI การยืนยันตัวตน

#### หน้าล็อกอิน (`apps/web/src/routes/sign-in/$.tsx`)

```typescript
import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/sign-in/$")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e1e2e] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center font-extrabold text-3xl text-[#cdd6f4]">
            {step === "signIn"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>
        </div>
        
        <form
          className="mt-8 space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            signIn("password", formData);
          }}
        >
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="email">
                Email address
              </label>
              <input
                autoComplete="email"
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-[#313244] bg-[#313244] px-3 py-2 text-[#cdd6f4] placeholder-[#45475a] focus:z-10 focus:border-[#89b4fa] focus:outline-none focus:ring-[#89b4fa] sm:text-sm"
                id="email"
                name="email"
                placeholder="Email address"
                required
                type="email"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                autoComplete="current-password"
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-[#313244] bg-[#313244] px-3 py-2 text-[#cdd6f4] placeholder-[#45475a] focus:z-10 focus:border-[#89b4fa] focus:outline-none focus:ring-[#89b4fa] sm:text-sm"
                id="password"
                name="password"
                placeholder="Password"
                required
                type="password"
              />
            </div>
          </div>
          
          <input name="flow" type="hidden" value={step} />
          
          <div>
            <button
              className="group base relative flex w-full justify-center rounded-md border border-transparent bg-[#89b4fa] px-4 py-2 font-medium text-[#1e1e2e] text-sm hover:bg-[#74c7ec] focus:outline-none focus:ring-2 focus:ring-[#89b4fa] focus:ring-offset-2"
              type="submit"
            >
              {step === "signIn" ? "Sign in" : "Sign up"}
            </button>
          </div>
          
          <div className="text-center">
            <button
              className="font-medium text-[#89b4fa] hover:text-[#74c7ec]"
              onClick={() => {
                setStep(step === "signIn" ? "signUp" : "signIn");
              }}
              type="button"
            >
              {step === "signIn"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

**ทำไมต้องใช้การนำไปใช้งานนี้?**
- `useAuthActions()`: Hook สำหรับเข้าถึงฟังก์ชันการยืนยันตัวตน
- `FormData`: API เบราว์เซอร์ดั้งเดิมสำหรับการจัดการฟอร์ม
- `step` state: สลับระหว่างโหมดล็อกอินและลงทะเบียน
- ฟิลด์ `flow` ที่ซ่อนอยู่: บอก Convex ว่าจะล็อกอินหรือลงทะเบียน
- การจัดแต่งทรงผมธีมมืด: ใช้ Tailwind พร้อมสีที่กำหนดเอง

### ขั้นตอนที่ 5: เส้นทางที่ป้องกันและข้อมูลผู้ใช้

#### หน้าหลัก (`apps/web/src/routes/index.tsx`)

```typescript
import {
  convexQuery,
  useConvexAuth,
  useConvexMutation,
} from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@workspace/backend/api";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
  const suspendUsers = convexQuery(api.users.getMany, {});
  const { data: users } = useSuspenseQuery(suspendUsers);

  // ตรวจสอบสถานะการยืนยันตัวตน
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    console.log({ isAuthenticated });
  }, [isAuthenticated]);

  // การเปลี่ยนแปลงเพื่อเพิ่มผู้ใช้ (ป้องกัน)
  const addUser = useConvexMutation(api.users.add);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <p>apps/web</p>
      <button
        className="cursor-pointer rounded-2xl bg-blue-300 p-2"
        onClick={() => {
          addUser();
        }}
        type="button"
      >
        Add User
      </button>
      <p> {JSON.stringify(users)}</p>
    </div>
  );
}
```

**ทำไมต้องใช้รูปแบบนี้?**
- `convexQuery`: สร้างออบเจกต์คิวรีสำหรับ TanStack Query
- `useSuspenseQuery`: ดึงข้อมูลพร้อมสถานะการโหลด
- `useConvexAuth`: Hook สำหรับตรวจสอบว่าผู้ใช้ได้รับการยืนยันตัวตนหรือไม่
- `useConvexMutation`: Hook สำหรับการเปลี่ยนแปลงที่ต้องการ auth

## การทดสอบการยืนยันตัวตน

### 1. สร้างบัญชี

1. นำทางไปยัง `http://localhost:3000/sign-in`
2. คลิก "Don't have an account? Sign up"
3. ป้อนอีเมลและรหัสผ่านของคุณ
4. คลิก "Sign up"

### 2. ล็อกอิน

1. ป้อนข้อมูลประจำตัวของคุณ
2. คลิก "Sign in"
3. คุณจะถูกเปลี่ยนเส้นทางไปยังหน้าหลัก

### 3. ทดสอบการกระทำที่ป้องกัน

1. ลองคลิกปุ่ม "Add User"
2. หากได้รับการยืนยันตัวตน จะสำเร็จ
3. หากไม่ได้รับการยืนยันตัวตน คุณจะได้รับข้อผิดพลาด

## ปัญหาทั่วไปและวิธีแก้ไข

### ปัญหา: ข้อผิดพลาด "Not Authenticated"

**ปัญหา**: ฟังก์ชัน `addUser` โยนข้อผิดพลาดการยืนยันตัวตน

**วิธีแก้ไข**: ตรวจสอบให้แน่ใจว่าคุณได้ล็อกอินก่อนพยายามเพิ่มผู้ใช้ Hook `useConvexAuth` ควรแสดง `isAuthenticated: true`

### ปัญหา: การเชื่อมต่อ Convex ล้มเหลว

**ปัญหา**: ฟรอนต์เอนด์ไม่สามารถเชื่อมต่อกับแบ็กเอนด์ Convex ได้

**วิธีแก้ไข**: 
1. ตรวจสอบให้แน่ใจว่า `VITE_CONVEX_URL` ถูกตั้งค่าอย่างถูกต้องใน `apps/web/.env.local`
2. ตรวจสอบให้แน่ใจว่าแบ็กเอนด์ Convex กำลังทำงาน (`bun run dev` ใน packages/backend)
3. ตรวจสอบว่า URL เป็น `http://localhost:3210`

### ปัญหา: ตัวแปรสภาพแวดล้อมไม่ทำงาน

**ปัญหา**: ตัวแปรสภาพแวดล้อมไม่ถูกโหลด

**วิธีแก้ไข**:
1. รีสตาร์ทเซิร์ฟเวอร์พัฒนาหลังจากเพิ่ม `.env.local`
2. ตรวจสอบให้แน่ใจว่าตัวแปรมีชื่อถูกต้อง (พร้อมคำนำหน้า `VITE_` สำหรับฟรอนต์เอนด์)
3. ตรวจสอบว่า `.env.local` อยู่ในไดเรกทอรีที่ถูกต้อง

## ขั้นตอนถัดไป

### 1. เพิ่ม Auth Providers มากขึ้น

ขยาย `auth.ts` เพื่อรวม OAuth providers:

```typescript
import { GitHub } from "@convex-dev/auth/providers/GitHub";
import { Google } from "@convex-dev/auth/providers/Google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      validatePasswordRequirements: () => {},
    }),
    GitHub,
    Google,
  ],
});
```

### 2. เพิ่มการจัดการโปรไฟล์ผู้ใช้

สร้างหน้าโปรไฟล์ที่ผู้ใช้สามารถอัปเดตข้อมูลของตนได้

### 3. ใช้การเข้าถึงตามบทบาท

เพิ่มบทบาทในสคีมาผู้ใช้ของคุณและใช้การตรวจสอบสิทธิ์

### 4. เพิ่มการยืนยันอีเมล

กำหนดค่า Convex เพื่อส่งอีเมลยืนยันเมื่อผู้ใช้ลงทะเบียน

## สรุป

ในบทสอนนี้ เราได้สร้างระบบยืนยันตัวตนที่สมบูรณ์โดยใช้:

- **Convex** สำหรับแบ็กเอนด์การยืนยันตัวตนและฐานข้อมูล
- **TanStack Start** สำหรับเฟรมเวิร์กฟรอนต์เอนด์
- **React Query** สำหรับการดึงข้อมูลและแคช
- **Tailwind CSS** สำหรับการจัดแต่งทรงผม
- **TypeScript** สำหรับความปลอดภัยของประเภท

แนวคิดหลักที่เราได้ครอบคลุม:

1. **การตั้งค่าสภาพแวดล้อม**: การกำหนดค่าที่เหมาะสมสำหรับการพัฒนา
2. **แบ็กเอนด์ Auth**: การกำหนดค่าการยืนยันตัวตนของ Convex
3. **สคีมาฐานข้อมูล**: การกำหนดโครงสร้างข้อมูลผู้ใช้
4. **การผสานรวมฟรอนต์เอนด์**: การเชื่อมต่อ React กับ Convex
5. **เส้นทางที่ป้องกัน**: การทำให้มั่นใจว่าเฉพาะผู้ใช้ที่ได้รับการยืนยันตัวตนเท่านั้นที่สามารถเข้าถึงฟีเจอร์บางอย่าง
6. **การจัดการผู้ใช้**: การสร้างและจัดการข้อมูลผู้ใช้

พื้นฐานนี้สามารถขยายเพื่อสร้างแอปพลิเคชันที่มีฟีเจอร์ครบครันพร้อมการยืนยันตัวตนผู้ใช้ การซิงโครไนซ์ข้อมูลแบบเรียลไทม์ และการดำเนินงานแบ็กเอนด์ที่ปลอดภัย