import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add imports
if "ScrollReveal" not in content:
    content = content.replace(
        'import { AnimatePresence, motion } from "framer-motion";',
        'import { AnimatePresence, motion } from "framer-motion";\nimport { ScrollReveal, RevealText, RevealImage } from "@/components/ui/scroll-reveal";'
    )

# 2. Hero Section
hero_target = """<div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 max-w-2xl pt-10">
            <div className="mb-14">"""
hero_replace = """<div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 max-w-2xl pt-10">
            <RevealText delay={0.1}><div className="mb-14">"""
content = content.replace(hero_target, hero_replace)

content = content.replace(
    '</span>\n            </div>\n            <h1 className="flex flex-col mb-10">',
    '</span>\n            </div></RevealText>\n            <h1 className="flex flex-col mb-10">'
)

content = content.replace(
    '<span className="text-[2.5rem] md:text-[3.5rem] font-light text-[#667085] tracking-tight leading-[1.1] mb-2">{th.heroT1}</span>',
    '<RevealText delay={0.2}><span className="text-[2.5rem] md:text-[3.5rem] font-light text-[#667085] tracking-tight leading-[1.1] mb-2 block">{th.heroT1}</span></RevealText>'
)
content = content.replace(
    '<span className="text-[4.5rem] md:text-[5.5rem] font-black text-[#101828] tracking-tighter leading-[1.0]">{th.heroT2}</span>',
    '<RevealText delay={0.3}><span className="text-[4.5rem] md:text-[5.5rem] font-black text-[#101828] tracking-tighter leading-[1.0] block">{th.heroT2}</span></RevealText>'
)
content = content.replace(
    '<span className="text-[3rem] md:text-[4rem] font-semibold text-[#101828]/90 tracking-tight leading-[1.0] mt-1">{th.heroT3}</span>',
    '<RevealText delay={0.4}><span className="text-[3rem] md:text-[4rem] font-semibold text-[#101828]/90 tracking-tight leading-[1.0] mt-1 block">{th.heroT3}</span></RevealText>'
)

content = content.replace(
    '<p className="text-[16px] md:text-[18px] text-[#101828] font-medium mb-12 tracking-wide flex items-center gap-3">',
    '<RevealText delay={0.5}><p className="text-[16px] md:text-[18px] text-[#101828] font-medium mb-12 tracking-wide flex items-center gap-3">'
)
content = content.replace(
    '<span>{th.heroSubD3}</span>\n            </p>',
    '<span>{th.heroSubD3}</span>\n            </p></RevealText>'
)

content = content.replace(
    '<p className="text-[16px] md:text-[17px] text-[#667085] font-normal mb-14 leading-[1.8] max-w-[480px]">',
    '<RevealText delay={0.6}><p className="text-[16px] md:text-[17px] text-[#667085] font-normal mb-14 leading-[1.8] max-w-[480px]">'
)
content = content.replace(
    '{th.heroDesc}\n            </p>',
    '{th.heroDesc}\n            </p></RevealText>'
)

content = content.replace(
    '<div className="flex flex-col sm:flex-row items-center gap-5">',
    '<RevealText delay={0.7}><div className="flex flex-col sm:flex-row items-center gap-5">'
)
content = content.replace(
    '{th.heroBtn2}\n              </Link>\n            </div>',
    '{th.heroBtn2}\n              </Link>\n            </div></RevealText>'
)

content = content.replace(
    '<div className="flex-1 w-full relative lg:h-[750px] h-[500px] flex items-center justify-end">',
    '<RevealImage delay={0.5} className="flex-1 w-full relative lg:h-[750px] h-[500px] flex items-center justify-end">'
)
content = content.replace(
    '<div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent mix-blend-multiply pointer-events-none"></div>\n            </div>\n          </div>',
    '<div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent mix-blend-multiply pointer-events-none"></div>\n            </div>\n          </RevealImage>'
)

# Replace <div className="max-w-[... with ScrollReveal
# Solutions
content = content.replace(
    '<div className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <div className="mb-24 md:flex flex-col">',
    '<ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <RevealText className="mb-24 md:flex flex-col">'
)
content = content.replace(
    '<p className="text-[18px] text-[#667085] font-normal max-w-2xl leading-[1.7]">{th.catSub}</p>\n          </div>',
    '<p className="text-[18px] text-[#667085] font-normal max-w-2xl leading-[1.7]">{th.catSub}</p>\n          </RevealText>'
)
# Close ScrollReveal at the end of Solutions
content = content.replace(
    '</Link>\n            ))}\n          </div>\n        </div>\n      </section>\n\n      {/* 3. Philosophy',
    '</Link>\n            ))}\n          </div>\n        </ScrollReveal>\n      </section>\n\n      {/* 3. Philosophy'
)

# Solutions items wrap in RevealImage (or just stagger)
content = content.replace(
    '<div className="aspect-[4/5] bg-[#F6F4EF] mb-8 relative overflow-hidden flex items-center justify-center">',
    '<RevealImage delay={i * 0.1}><div className="aspect-[4/5] bg-[#F6F4EF] mb-8 relative overflow-hidden flex items-center justify-center">'
)
content = content.replace(
    '<div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500 pointer-events-none"></div>\n                </div>\n                <div className="border-b border-[#101828]/10 pb-6 mb-5">',
    '<div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500 pointer-events-none"></div>\n                </div></RevealImage>\n                <div className="border-b border-[#101828]/10 pb-6 mb-5">'
)

# 3. Philosophy
content = content.replace(
    '<div className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <div className="max-w-4xl mb-32">',
    '<ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <RevealText className="max-w-4xl mb-32">'
)
content = content.replace(
    '<h2 className="text-[40px] md:text-[64px] font-bold text-[#101828] tracking-tighter leading-[1.1]">{th.philTitle}</h2>\n          </div>',
    '<h2 className="text-[40px] md:text-[64px] font-bold text-[#101828] tracking-tighter leading-[1.1]">{th.philTitle}</h2>\n          </RevealText>'
)
content = content.replace(
    '</p>\n              </div>\n            ))}\n          </div>\n        </div>\n      </section>\n\n      {/* 4. Archive',
    '</p>\n              </div>\n            ))}\n          </div>\n        </ScrollReveal>\n      </section>\n\n      {/* 4. Archive'
)

# 4. Archive
content = content.replace(
    '<div className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <div className="flex flex-col md:flex-row justify-between items-end mb-24">',
    '<ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <RevealText className="flex flex-col md:flex-row justify-between items-end mb-24">'
)
content = content.replace(
    '{th.caseLink}\n            </Link>\n          </div>',
    '{th.caseLink}\n            </Link>\n          </RevealText>'
)
content = content.replace(
    '</p>\n                    </div>\n                  </div>\n                  );\n                })}\n              </div>\n          </div>\n        </div>\n      </section>\n\n      {/* 5. Craft',
    '</p>\n                    </div>\n                  </div>\n                  );\n                })}\n              </div>\n          </div>\n        </ScrollReveal>\n      </section>\n\n      {/* 5. Craft'
)
# Wrap archive images
content = content.replace(
    '<div className="lg:col-span-8 bg-[#FBFAF7] relative group overflow-hidden flex flex-col justify-end p-12 lg:h-full h-[550px]">',
    '<RevealImage delay={0.1} className="lg:col-span-8 bg-[#FBFAF7] relative group overflow-hidden flex flex-col justify-end p-12 lg:h-full h-[550px]">'
)
content = content.replace(
    '<ArrowRight className="w-5 h-5" strokeWidth={2} />\n                     </div>\n                  </div>\n               </div>',
    '<ArrowRight className="w-5 h-5" strokeWidth={2} />\n                     </div>\n                  </div>\n               </RevealImage>'
)

content = content.replace(
    '<div key={i} className="flex-1 bg-[#FBFAF7] relative group overflow-hidden flex flex-col justify-end p-10 min-h-[400px]">',
    '<RevealImage key={i} delay={i * 0.2 + 0.2} className="flex-1 bg-[#FBFAF7] relative group overflow-hidden flex flex-col justify-end p-10 min-h-[400px]">'
)
content = content.replace(
    '<p className="text-white/80 text-[14px] font-medium tracking-wide">{c.d}</p>\n                    </div>\n                  </div>',
    '<p className="text-white/80 text-[14px] font-medium tracking-wide">{c.d}</p>\n                    </div>\n                  </RevealImage>'
)


# 5. Craft
content = content.replace(
    '<div className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <div className="flex justify-between items-end mb-24 pb-8">',
    '<ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <RevealText className="flex justify-between items-end mb-24 pb-8">'
)
content = content.replace(
    '<span className="text-[12px] font-medium tracking-[0.2em] text-[#667085] uppercase hidden md:block">{th.craftTag}</span>\n          </div>',
    '<span className="text-[12px] font-medium tracking-[0.2em] text-[#667085] uppercase hidden md:block">{th.craftTag}</span>\n          </RevealText>'
)
content = content.replace(
    '</p>\n              </div>\n            ))}\n          </div>\n        </div>\n      </section>\n\n      {/* 6. Why',
    '</p>\n              </div>\n            ))}\n          </div>\n        </ScrollReveal>\n      </section>\n\n      {/* 6. Why'
)

# 6. Why
content = content.replace(
    '<div className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <h2 className="text-[40px] md:text-[56px] font-bold text-[#101828] tracking-tighter mb-24 max-w-3xl leading-[1.1]">',
    '<ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <RevealText>\n          <h2 className="text-[40px] md:text-[56px] font-bold text-[#101828] tracking-tighter mb-24 max-w-3xl leading-[1.1]">'
)
content = content.replace(
    '{th.whyTitle2}\n          </h2>',
    '{th.whyTitle2}\n          </h2>\n          </RevealText>'
)
content = content.replace(
    '</p>\n              </div>\n            ))}\n          </div>\n        </div>\n      </section>\n\n      {/* 7. Flow',
    '</p>\n              </div>\n            ))}\n          </div>\n        </ScrollReveal>\n      </section>\n\n      {/* 7. Flow'
)

# 7. Flow
content = content.replace(
    '<div className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <h2 className="text-[36px] md:text-[48px] font-bold text-[#101828] tracking-tight mb-32">{th.flowTitle}</h2>',
    '<ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">\n          <RevealText>\n          <h2 className="text-[36px] md:text-[48px] font-bold text-[#101828] tracking-tight mb-32">{th.flowTitle}</h2>\n          </RevealText>'
)
content = content.replace(
    '</p>\n              </div>\n            ))}\n          </div>\n        </div>\n      </section>\n\n      {/* 8. Sus',
    '</p>\n              </div>\n            ))}\n          </div>\n        </ScrollReveal>\n      </section>\n\n      {/* 8. Sus'
)

# 8. Sus
content = content.replace(
    '<div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between gap-24">\n          <div className="max-w-[700px]">',
    '<ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between gap-24">\n          <RevealText className="max-w-[700px]">'
)
content = content.replace(
    '<p className="text-[18px] text-[#667085] font-medium leading-[1.8] max-w-[550px]">{th.susSub}</p>\n          </div>',
    '<p className="text-[18px] text-[#667085] font-medium leading-[1.8] max-w-[550px]">{th.susSub}</p>\n          </RevealText>'
)
content = content.replace(
    '</li>\n               ))}\n             </ul>\n          </div>\n        </div>\n      </section>\n\n      {/* 9. FAQ',
    '</li>\n               ))}\n             </ul>\n          </div>\n        </ScrollReveal>\n      </section>\n\n      {/* 9. FAQ'
)

# 9. FAQ
content = content.replace(
    '<div className="max-w-4xl mx-auto px-6 lg:px-12">\n            <h2 className="text-[36px] md:text-[48px] font-bold text-[#101828] tracking-tight mb-24">{th.faqTitle}</h2>',
    '<ScrollReveal className="max-w-4xl mx-auto px-6 lg:px-12">\n            <RevealText><h2 className="text-[36px] md:text-[48px] font-bold text-[#101828] tracking-tight mb-24">{th.faqTitle}</h2></RevealText>'
)
content = content.replace(
    '</div>\n                  </div>\n                </div>\n              ))}\n            </div>\n         </div>\n      </section>\n\n      {/* 10. CTA',
    '</div>\n                  </div>\n                </div>\n              ))}\n            </div>\n         </ScrollReveal>\n      </section>\n\n      {/* 10. CTA'
)

# 10. CTA
content = content.replace(
    '<div className="max-w-[1000px] mx-auto px-6 lg:px-12 text-center">\n          <h2 className="text-[4rem] md:text-[6.5rem] font-black text-[#101828] tracking-tighter mb-10 leading-[1.0] capitalize">',
    '<ScrollReveal className="max-w-[1000px] mx-auto px-6 lg:px-12 text-center">\n          <RevealText delay={0.1}>\n          <h2 className="text-[4rem] md:text-[6.5rem] font-black text-[#101828] tracking-tighter mb-10 leading-[1.0] capitalize">'
)
content = content.replace(
    '{th.ctaTitle2}\n          </h2>',
    '{th.ctaTitle2}\n          </h2>\n          </RevealText>'
)
content = content.replace(
    '<p className="text-[18px] md:text-[20px] text-[#667085] font-medium mb-24 max-w-[600px] mx-auto leading-[1.8]">\n            {th.ctaSub}\n          </p>',
    '<RevealText delay={0.2}>\n          <p className="text-[18px] md:text-[20px] text-[#667085] font-medium mb-24 max-w-[600px] mx-auto leading-[1.8]">\n            {th.ctaSub}\n          </p>\n          </RevealText>'
)
content = content.replace(
    '<div className="flex flex-col sm:flex-row justify-center gap-6">',
    '<RevealText delay={0.3}>\n          <div className="flex flex-col sm:flex-row justify-center gap-6">'
)
content = content.replace(
    '{th.ctaBtn2}\n            </Link>\n          </div>\n        </div>\n      </section>',
    '{th.ctaBtn2}\n            </Link>\n          </div>\n          </RevealText>\n        </ScrollReveal>\n      </section>'
)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Modification complete.")
