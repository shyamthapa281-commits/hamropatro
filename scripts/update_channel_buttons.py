import re

with open('src/components/ReceivePaymentsView.tsx', 'r') as f:
    content = f.read()

# 1. Update channel button badges to indicate OTP protection for aus_bank and nepal_bank
# Find aus_bank button
old_aus_btn = """            {/* 3. Australia Local Bank (PayID / BSB) */}
            <button
              type="button"
              onClick={() => setSelectedChannel('aus_bank')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                selectedChannel === 'aus_bank'
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-500/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  Australia
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  PayID / Bank Transfer
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne' ? 'अष्ट्रेलिया स्थानीय बैंक वा PayID' : 'Commonwealth Bank / PayID'}
                </p>
              </div>
            </button>"""

new_aus_btn = """            {/* 3. Australia Local Bank (PayID / BSB - OTP Protected) */}
            <button
              type="button"
              onClick={() => setSelectedChannel('aus_bank')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                selectedChannel === 'aus_bank'
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-500/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/60 flex items-center gap-1">
                  {isBankUnlocked ? <Unlock className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
                  <span>{isBankUnlocked ? 'Unlocked' : 'OTP Protected'}</span>
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  PayID / Bank Transfer
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne' ? 'अष्ट्रेलिया स्थानीय बैंक वा PayID' : 'Commonwealth Bank / PayID'}
                </p>
              </div>
            </button>"""

if old_aus_btn in content:
    content = content.replace(old_aus_btn, new_aus_btn)
    print("Replaced aus_btn")
else:
    print("Could not find exact old_aus_btn")

# Find nepal_bank button
old_nepal_btn = """            {/* 4. Nepal Bank Account */}
            <button
              type="button"
              onClick={() => setSelectedChannel('nepal_bank')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                selectedChannel === 'nepal_bank'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-600/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  Nepal
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  Nepal Bank Transfer
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne' ? 'NMB Bank / ConnectIPS / QR' : 'NMB Bank direct account'}
                </p>
              </div>
            </button>"""

new_nepal_btn = """            {/* 4. Nepal Bank Account - OTP Protected */}
            <button
              type="button"
              onClick={() => setSelectedChannel('nepal_bank')}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                selectedChannel === 'nepal_bank'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-600/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 flex items-center gap-1">
                  {isBankUnlocked ? <Unlock className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-emerald-600" />}
                  <span>{isBankUnlocked ? 'Unlocked' : 'OTP Protected'}</span>
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  Nepal Bank Transfer
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {lang === 'ne' ? 'NMB Bank / ConnectIPS / QR' : 'NMB Bank direct account'}
                </p>
              </div>
            </button>"""

if old_nepal_btn in content:
    content = content.replace(old_nepal_btn, new_nepal_btn)
    print("Replaced nepal_btn")
else:
    print("Could not find exact old_nepal_btn")

with open('src/components/ReceivePaymentsView.tsx', 'w') as f:
    f.write(content)
print("Updated buttons successfully!")
