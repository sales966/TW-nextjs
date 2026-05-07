"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "zh" | "tw";

const dictionaries = {
  en: {
    nav: {
      home: "Home", products: "Products", pricing: "Pricing", types: "Types", materials: "Materials", sustainability: "Sustainability", about: "About", contact: "Contact", quote: "Request Quote",
    },
    megaMenu: {
      luxury: {
        title: "LUXURY BOUTIQUE BAGS",
        items: ["Coated Art Paper Bags", "Black Cardboard Foil Bags", "Textured Premium Bags", "Pantone Printed Bags"]
      },
      retail: {
        title: "RETAIL CARRIERS",
        items: ["Woodfree Paper Bags", "Thick White Kraft Bags", "Ribbon Handle Bags", "Cotton Rope Wide Bags"]
      },
      eco: {
        title: "ECO KRAFT BAGS",
        items: ["Natural Brown Kraft", "Recycled Eco Bags", "Soy Ink Printed", "SOS Block Bottom Bags"]
      },
      takeaway: {
        title: "FOOD & TAKEAWAY",
        items: ["Wide Bottom Delivery Bags", "Greaseproof Bakery Bags", "Thermal Insulated Paper Bags", "Flat Paper Bags"]
      },
      collections: {
        title: "COLLECTIONS",
        items: ["All Featured Bags"]
      }
    },
    home: {
      heroTag: "Professional Custom Packaging",
      heroT1: "Premium Custom", heroT2: "Paper Bag Solutions", heroT3: "For Modern Brands",
      heroSubD1: "Luxury Bags", heroSubD2: "Retail Carriers", heroSubD3: "Eco-Friendly Kraft Bags",
      heroDesc: "We provide professional custom paper packaging solutions, focusing on durability, aesthetics, and structural design to elevate your brand presence.",
      heroBtn1: "Explore Products", heroBtn2: "Request a Quote",
      
      catTitle: "Our Shopping Bag Solutions",
      catSub: "From high-volume retail bags to premium boutique carriers, we offer comprehensive packaging support for various industries.",
      cats: [
        { t: "Luxury Boutique Bags", d: "High-end bespoke bags made with premium art paper and elegant ribbon handles." },
        { t: "Retail Carrier Bags", d: "Durable and cost-effective paper bags designed for everyday retail packaging." },
        { t: "Eco-Kraft Bags", d: "Sustainable kraft paper bags, highly durable and environmentally friendly." },
        { t: "Specialty Coated Bags", d: "High-quality coated paper bags offering enhanced protection and visual appeal." }
      ],
      
      philTag: "Brand Philosophy",
      philTitle: "More than packaging. A moving billboard for your brand.",
      phils: [
        { t: "Unified Aesthetics and Durability", d: "Seamlessly combining elegant designs with reinforced structures for reliable load-bearing capacity." },
        { t: "Smooth Transition to Mass Production", d: "Ensuring high precision from design concept to automated manufacturing." },
        { t: "Balancing Quality and Cost", d: "Optimizing material sourcing and production processes to deliver premium quality within your budget." }
      ],
      
      caseTitle: "Featured Portfolio",
      caseSub: "Showcasing our versatile custom packaging solutions tailored for various industries.",
      caseLink: "View Portfolio",
      cases: [
        { t: "Beauty & Cosmetics", d: "Premium Packaging for Skincare Brands" },
        { t: "Fashion & Retail", d: "Luxury Boutique Carriers" },
        { t: "Food & Beverage", d: "Eco-Friendly Takeaway Bags" }
      ],
      
      craftTitle: "Materials & Craftsmanship",
      craftTag: "Material Finishes",
      crafts: [
        { n: "Premium Kraft Paper", d: "Made from natural fibers, offering high tear resistance and sustainability." },
        { n: "High-Density Art Paper", d: "Durable coated and uncoated boards providing crisp folding edges and strong structure." },
        { n: "Hot Foil Stamping", d: "Precision foil stamping to add an elegant and luxurious touch to your branding." },
        { n: "Custom Handles", d: "A variety of handle options including organic cotton, grosgrain ribbons, and twisted paper cords." }
      ],
      
      whyTitle1: "Why Choose", whyTitle2: "Dawn Bags",
      whys: [
        { t: "Rigorous Quality Control", d: "We provide fully constructed prototypes before mass production to ensure structural integrity and your total satisfaction." },
        { t: "Flexible Customization", d: "We offer tailored solutions for unique dimensions, colors, and handle structures to meet your exact requirements." },
        { t: "Reliable Mass Production", d: "Equipped with advanced automated machinery to handle high-volume orders with speed and consistency." },
        { t: "Commitment to Sustainability", d: "Sourcing FSC-certified paper and using soy-based inks to support your corporate environmental initiatives." }
      ],
      
      flowTitle: "Our Process",
      flows: [
        { t: "Requirement Submission", d: "Share your specifications including size, material preferences, and design vision." },
        { t: "Proposal & Quotation", d: "We accurately calculate costs based on your requirements and provide a competitive quote." },
        { t: "Prototyping", d: "We create functional samples for you to confirm the design, color, and physical durability." },
        { t: "Production & Delivery", d: "Efficient mass production backed by global shipping services directly to your specified location." }
      ],
      
      susTitleH1: "Committed to",
      susTitleH2: "Sustainable Packaging.",
      susSub: "We prioritize responsible sourcing and eco-friendly materials to help brands seamlessly transition to greener packaging alternatives.",
      susList: ["FSC® Certified Paper Sources", "Eco-Friendly Soy-Based Inks", "Recyclable and Biodegradable Materials", "Sustainable Handle Alternatives"],
      
      faqTitle: "Frequently Asked Questions",
      faqs: [
        { q: "What is your Minimum Order Quantity (MOQ)?", a: "Our standard custom bags start at 1,000 units. For fully automated base designs, we offer highly competitive pricing on larger volumes." },
        { q: "Can I fully customize the bags?", a: "Yes. Dimensions, material weight, printing colors, finishes, and handles can all be customized to your exact specifications." },
        { q: "How long does prototyping take?", a: "Blank structural samples take 3-5 business days. Full-color printed samples typically take 7-10 business days." },
        { q: "Are your materials environmentally friendly?", a: "Yes. We offer a wide range of eco-friendly options, including FSC-certified paper, recyclable glues, and soy-based inks." },
        { q: "Do you ship internationally?", a: "Absolutely. We handle professional pallet packaging and offer reliable sea and air freight shipping globally." }
      ],
      
      ctaTitle1: "Start Your Custom",
      ctaTitle2: "Packaging Project.",
      ctaSub: "Tell us about your volume and design requirements. Our team of packaging experts is ready to provide you with tailored solutions.",
      ctaBtn1: "Request a Quote",
      ctaBtn2: "Contact Our Team"
    },
    plp: {
      title: "Product Catalog", sub: "Explore our comprehensive range of custom paper carrier bags.",
      filter: "Filter Products", materials: "Material Type", eco: "Eco Standard", sort: "Sort By", view: "View Details",
      catsAll: "All Categories", cats: ["Luxury Boutique Bags", "Retail Carriers", "Kraft Paper Bags", "Gift Packaging", "Accessories"],
      mats: ["Kraft Paper", "White Cardboard", "Art Paper", "Specialty Paper"],
      ecos: ["FSC Certified", "Recyclable", "Soy Ink Printed"],
      showingCount: "Showing all results",
      cardTag: "Featured Product", cardTitle: "Custom Boutique Bag",
      cardSpec1: "FSC Certified Paper", cardSpec2: "Premium Ribbon Handle"
    },
    pdp: {
      back: "Back to Products", spec: "Specifications", mat: "Material Options", fin: "Finishes & Handles", moq: "Base MOQ", lead: "Lead Time", features: "Key Features",
      reqQuote: "Request a Quote", formT: "Get Pricing Info", formS: "Provide your target quantity and custom details to receive an exact quotation.",
      mockCat: "Luxury Retail Bag",
      mockTitle: "Premium Custom Boutique Bag",
      mockDesc: "Constructed with durable high-quality cardboard and reinforced bottom gussets. Perfect for cosmetics, jewelry, and high-end retail packaging.",
      mockMatVal: "Customizable Art Paper (200g - 350g)",
      mockFinVal: "Ribbon Handle + Foil Stamping",
      mockMoqVal: "1000 Units",
      mockLeadVal: "2-3 Weeks"
    },
    quote: {
      title: "Request a Quote", sub: "Fill out the form below with your requirements, and our team will get back to you with competitive pricing.",
      s1: "Basic Needs", s2: "Specifications", s3: "Contact Details",
      fname: "First Name", lname: "Last Name", email: "Email Address", phone: "Phone Number", comp: "Product Name", qty: "Estimated Quantity", msg: "Project Details & Specific Requirements", submit: "Submit Inquiry",
      formB1: "Project Scope", formB2: "Dimensions & Materials", formB3: "Your Contact Info",
      btnBack: "Back", btnNext: "Next",
      opt1: "1,000 - 5,000", opt2: "5,000 - 20,000", opt3: "20,000 - 100,000", opt4: "100,000+",
      ph: "e.g., Size: 400x300x150mm. Material: 250g brown kraft. Finishing: White logo print, twisted paper handle.",
      doneT: "Inquiry Submitted", doneS: "Thank you for reaching out. Our packaging specialists will review your details and contact you shortly."
    },
    footer: {
      desc: "Providing professional custom paper bag solutions. We focus on quality, reliability, and sustainable manufacturing practices.",
      pTitle: "Products", p1: "Boutique Bags", p2: "Kraft Bags", p3: "Retail Carriers", p4: "Shipping Bags",
      rTitle: "Resources", r1: "Size Guide", r2: "Material Index", r3: "Handle Options", r4: "Our Sustainability",
      cTitle: "Company", c1: "About Us", c2: "Contact", c3: "Request a Quote", c4: "Factory Tour",
      rights: "All rights reserved. Designed by Dawn Bags.",
      privacy: "Privacy Policy", tos: "Terms of Service"
    }
  },
  zh: {
    nav: {
      home: "首页", products: "产品服务", pricing: "估价计算器", types: "包装类型", materials: "材质指引", sustainability: "可持续承诺", about: "关于我们", contact: "联系方式", quote: "获取报价",
    },
    megaMenu: {
      luxury: {
        title: "高端精品提袋",
        items: ["白卡纸覆膜袋", "黑卡纸烫金袋", "特种触感纸袋", "专色印刷礼袋"]
      },
      retail: {
        title: "商业零售纸袋",
        items: ["双胶纸服装袋", "加厚白牛皮袋", "丝带提手纸袋", "棉绳宽底纸袋"]
      },
      eco: {
        title: "环保牛皮纸袋",
        items: ["原色本牛手提袋", "再生环保包装", "大豆油墨印刷袋", "无提手方底袋"]
      },
      takeaway: {
        title: "餐饮与外卖袋",
        items: ["宽底外卖打包袋", "防油烘焙纸袋", "冷链保温纸袋", "一次性平口袋"]
      },
      collections: {
        title: "精选系列",
        items: ["全部精选纸袋"]
      }
    },
    home: {
      heroTag: "专业定制纸袋制造商",
      heroT1: "为现代品牌提供", heroT2: "高品质定制纸袋", heroT3: "包装解决方案",
      heroSubD1: "精品礼袋", heroSubD2: "零售包装袋", heroSubD3: "环保牛皮纸袋",
      heroDesc: "我们专注于提供专业、耐用且美观的定制纸袋服务。从材质选择、结构设计到印刷工艺，全力提升您的品牌形象。",
      heroBtn1: "浏览产品系列", heroBtn2: "获取专属报价",
      
      catTitle: "我们的包装袋解决方案",
      catSub: "无论您需要大批量的日常零售包装，还是高端定制的品牌礼袋，我们都能为您提供完善的生产支持。",
      cats: [
        { t: "高端精品纸袋", d: "采用优质特种纸及定制丝带，为高档商业零售提供兼具质感和耐用性的品牌礼袋。" },
        { t: "商业零售纸袋", d: "坚固且经济实惠的包装选择，适用于日常零售与连锁商店的高频使用场景。" },
        { t: "环保牛皮纸袋", d: "使用原装精选牛皮纸制造，韧性强、承重好，且符合各类环保可持续标准。" },
        { t: "特种工艺纸袋", d: "提供覆膜、烫金、UV等特殊表面处理工艺，让您的产品包装更具视觉吸引力。" }
      ],
      
      philTag: "服务理念",
      philTitle: "包装，也是品牌的流动名片。",
      phils: [
        { t: "设计与实用性的平衡", d: "我们在保证包装外观精美的同时，严格把控打胶及底托结构，确保包装的承重性与安全性。" },
        { t: "从设计到量产的严谨交付", d: "凭借成熟的自动化产线，全面降低图纸设计与最终实物产品之间的生产误差。" },
        { t: "优化成本呈现高质感", d: "依托规模化材料采购与高效流水线生产，用合理的成本为您呈现超越预期的包装体验。" }
      ],
      
      caseTitle: "合作案例",
      caseSub: "我们为美妆、服饰、食品等多个行业的品牌提供定制化的包装实施方案。",
      caseLink: "查看完整案例",
      cases: [
        { t: "医疗与健康服务", d: "知名医院与医疗机构专属包装" },
        { t: "文化与出版传媒", d: "大型出版集团高端文化礼品袋" },
        { t: "农特产品与高端礼赠", d: "传统名贵食材定制手提袋" }
      ],
      
      craftTitle: "材质与工艺选择",
      craftTag: "细节与品质体现",
      crafts: [
        { n: "优质牛皮纸体系", d: "以原木浆为主的长纤维纸张，提供出色的抗拉拽能力与温润的原生触感。" },
        { n: "高克重白卡/黑卡纸", d: "使用高克重卡纸，让纸袋的侧折线更加清晰锐利，整体结构笔挺高端。" },
        { n: "精密烫印与特殊表面", d: "掌握压纹、烫金、满版纯色印刷等工艺，确保视觉呈现更加立体饱满。" },
        { n: "多样化提手配置", d: "从基础的纸绳、扁平棉绳，到定制螺纹带、丝缎带，为您打造最舒适的手握体验。" }
      ],
      
      whyTitle1: "选择 Dawn Bags", whyTitle2: "的理由",
      whys: [
        { t: "标准化的打样验证", d: "大规模量产前，我们会提供实体结构样板验证或印刷色样，让您在最终确认前感到安心。" },
        { t: "灵活的定制选项", d: "包容各种独特的尺寸长宽比、特殊的打孔需求以及精准的 Pantone 专色调配。" },
        { t: "稳定高效的量产能力", d: "工厂配备先进的自动化糊底和穿绳设备，大批量订单也能保证品质的一致性与稳定的交期。" },
        { t: "坚定的可持续发展路线", d: "我们支持使用 FSC 认证溯源纸材，并推广环保大豆油墨印刷，助您落实企业的环保目标。" }
      ],
      
      flowTitle: "项目合作流程",
      flows: [
        { t: "需求沟通", d: "通过详细沟通确认纸袋的尺寸、提绳选型、外观设计预期及纸张克重要求。" },
        { t: "方案报价", d: "基于包装展开面积及材料成本进行准确核算，提供极具竞争力的工厂直客指导价。" },
        { t: "确认与打样", d: "为客户制作1:1实物打样（含色彩展示及承重测试），由双方完成投产前的最终确认。" },
        { t: "量产与交付", d: "全面启动批量化生产并包装入库，我们支持集装箱整柜与拼箱等全球物流发运协助。" }
      ],
      
      susTitleH1: "致力于推动",
      susTitleH2: "可持续包装的发展",
      susSub: "从源头追踪造纸来源，并在生产环节中采用环保做法。我们期望通过环保包装材料的普及，为您的品牌赋予更强的社会责任感和生态背书。",
      susList: ["FSC® 森林管理委员会认证纸源", "符合环保标准的大豆油墨印刷", "推广全面可回收、易降解材料", "倡导使用全棉等环保可回收提手"],
      
      faqTitle: "常见问题解答",
      faqs: [
        { q: "纸袋的定制起订量 (MOQ) 是一般是多少？", a: "常规定制纸袋通常为 1,000 个起订。如果是手工要求度高的高级精品袋也支持更小的测单量；对于全自动机型的大批量投产，数量越多单价越有竞争力。" },
        { q: "尺寸、材质或工艺可以做到完全量身定制吗？", a: "毫无疑问。从专属的长宽厚比例、承重底板的厚度，到全面印刷以及提手材质（如棉绳、人字带、纸扭绳），均能以您的品牌要求做高度定制。" },
        { q: "确版与打样周期需要多长时间？", a: "空白版结构白样确认需要 3-5 个工作日；如果是包含全彩印刷与特殊烫金工艺的实物彩样，一般需要 7-10 个工作日进行准备。" },
        { q: "您公司提供的包装材质是环保的吗？", a: "是的。我们为客户提供丰富的、合乎国际环保标准的纸张选择，并坚持采用环保粘结剂和大豆油墨进行加工生产。" },
        { q: "是否支持货物出口及全球物流运输？", a: "支持。我们拥有常年的出口成案及包装规范经验，可以协助您办理面向全球主要港口的海运与空运全套配送流程。" }
      ],
      
      ctaTitle1: "开启您的专属",
      ctaTitle2: "包装定制方案",
      ctaSub: "只需向我们提供您所需的纸袋数量、大致尺寸或应用场景。我们的专业包装人员会在收到信息后及时为您核算成本并建议合理方案。",
      ctaBtn1: "获取详细工厂报价",
      ctaBtn2: "联系我们的业务代表"
    },
    plp: {
      title: "产品展示目录", sub: "浏览我们经过实际生产验证的各类型纸质包装袋案例与说明。",
      filter: "产品筛选", materials: "纸张材质", eco: "环保选项", sort: "产品排序", view: "查看详情",
      catsAll: "所有产品类别", cats: ["高端精品纸袋", "商业零售纸袋", "牛皮手提袋", "特种包装工艺", "附加辅料"],
      mats: ["原生牛皮纸", "高白卡纸", "铜版纸", "特种皮纹纸"],
      ecos: ["FSC 认证纸源", "可循环材料", "环保大豆油墨"],
      showingCount: "当前显示产品",
      cardTag: "品牌推荐款", cardTitle: "高端精品服装纸袋",
      cardSpec1: "FSC 高精卡纸", cardSpec2: "高密定制防滑棉绳"
    },
    pdp: {
      back: "返回产品列表", spec: "规格属性", mat: "推荐材质", fin: "工艺及提手", moq: "基础起订量", lead: "参考生产周期", features: "工艺特点",
      reqQuote: "获取同款报价", formT: "获取具体制作成本", formS: "请提交您预期的采购数量及联系方式，我们会在最快的时间内向您发送详细的价格清单。",
      mockCat: "商业品牌经典包装",
      mockTitle: "高质感品牌零售精品袋",
      mockDesc: "采用稳定且耐压的高克重卡纸制作，配以加固底座结实耐用。外观优雅，非常适合作为高档服饰、化妆品、电子科技类产品的专属包装载体。",
      mockMatVal: "高克重卡纸 + 承重底板加固",
      mockFinVal: "烫金工艺 + 哑光/触感覆膜",
      mockMoqVal: "标准款 1000 个起订",
      mockLeadVal: "排单生产约 10-15 天"
    },
    quote: {
      title: "定制需求表单", sub: "请尽可能详细地说明您的包装规格要求（例如具体尺寸、印刷色系），这将有助于我们更精准、快速地为您预估出厂价格。",
      s1: "基础信息", s2: "规格与工艺", s3: "联系方式",
      fname: "名字", lname: "姓氏", email: "电子邮箱", phone: "联系电话", comp: "产品名称", qty: "预估采购数量", msg: "项目细节与其他特殊要求", submit: "提交询价申请",
      formB1: "确认所需大致范围", formB2: "尺寸长宽高与用纸情况", formB3: "获取报价的联络方式",
      btnBack: "上一步", btnNext: "下一步",
      opt1: "1,000 - 5,000 件", opt2: "5,000 - 20,000 件", opt3: "20,000 - 100,000 件", opt4: "100,000 件以上",
      ph: "参考示例：尺寸要求为 长400 x 高300 x 侧宽150 mm。需要使用 250克棕色牛皮纸。外观带有单色印刷标志，采用扭纹纸绳作为提手等...",
      doneT: "需求清单提交成功", doneS: "我们的包装顾问已经收到您的信息，将在最短工作时间内与您团队确认需求并给出书面的方案报价。"
    },
    footer: {
      desc: "提供坚实耐用、工艺专业的定制纸袋产品。借助规范化的加工体系与环保材质，为客户交付体现品牌真实价值的包装方案。",
      pTitle: "核心产品", p1: "精致礼品袋定制", p2: "环保牛皮纸袋", p3: "高质量卡纸手提袋", p4: "常规外带平口口袋",
      rTitle: "包装资料指引", r1: "尺寸规格指南", r2: "常见纸张与克重推荐", r3: "提绳选用图表", r4: "环保规范报告",
      cTitle: "公司信息", c1: "了解我们", c2: "联系方式", c3: "索取工厂报价", c4: "生产车间与设备",
      rights: "版权所有。由 Dawn Bags 团队技术支持。",
      privacy: "隐私政策", tos: "服务条款交易规章"
    }
  },
  tw: {
    nav: {
      home: "首頁", products: "產品服務", pricing: "估價計算器", types: "包裝類型", materials: "材質指引", sustainability: "永續承諾", about: "關於我們", contact: "聯絡方式", quote: "獲取報價",
    },
    megaMenu: {
      luxury: {
        title: "高端精品提袋",
        items: ["白卡紙覆膜袋", "黑卡紙燙金袋", "特種觸感紙袋", "專色印刷禮袋"]
      },
      retail: {
        title: "商業零售紙袋",
        items: ["雙膠紙服裝袋", "加厚白牛皮袋", "絲帶提手紙袋", "棉繩寬底紙袋"]
      },
      eco: {
        title: "環保牛皮紙袋",
        items: ["原色本牛手提袋", "再生環保包裝", "大豆油墨印刷袋", "無提手方底袋"]
      },
      takeaway: {
        title: "餐飲與外賣袋",
        items: ["寬底外賣打包袋", "防油烘焙紙袋", "冷鏈保溫紙袋", "一次性平口袋"]
      },
      collections: {
        title: "精選系列",
        items: ["全部精選紙袋"]
      }
    },
    home: {
      heroTag: "專業客製紙袋製造商",
      heroT1: "為現代品牌提供", heroT2: "高品質客製紙袋", heroT3: "包裝解決方案",
      heroSubD1: "精品禮袋", heroSubD2: "零售包裝袋", heroSubD3: "環保牛皮紙袋",
      heroDesc: "我們專注於提供專業、耐用且美觀的客製紙袋服務。從材質選擇、結構設計到印刷工藝，全力提升您的品牌形象。",
      heroBtn1: "瀏覽產品系列", heroBtn2: "獲取專屬報價",
      
      catTitle: "我們的包裝袋解決方案",
      catSub: "無論您需要大批量的日常零售包裝，還是高端客製的品牌禮袋，我們都能為您提供完善的生產支援。",
      cats: [
        { t: "高端精品紙袋", d: "採用優質特種紙及客製絲帶，為高檔商業零售提供兼具質感和耐用性的品牌禮袋。" },
        { t: "商業零售紙袋", d: "堅固且經濟實惠的包裝選擇，適用於日常零售與連鎖商店的高頻使用場景。" },
        { t: "環保牛皮紙袋", d: "使用原裝精選牛皮紙製造，韌性強、承重好，且符合各類環保永續標準。" },
        { t: "特種工藝紙袋", d: "提供覆膜、燙金、UV等特殊表面處理工藝，讓您的產品包裝更具視覺吸引力。" }
      ],
      
      philTag: "服務理念",
      philTitle: "包裝，也是品牌的流動名片。",
      phils: [
        { t: "設計與實用性的平衡", d: "我們在保證包裝外觀精美的同時，嚴格把控打膠及底托結構，確保包裝的承重性與安全性。" },
        { t: "從設計到量產的嚴謹交付", d: "憑藉成熟的自動化產線，全面降低圖紙設計與最終實物產品之間的生產誤差。" },
        { t: "優化成本呈現高質感", d: "依托規模化材料採購與高效流水線生產，用合理的成本為您呈現超越預期的包裝體驗。" }
      ],
      
      caseTitle: "合作案例",
      caseSub: "我們為美妝、服飾、食品等多個行業的品牌提供客製化的包裝實施方案。",
      caseLink: "查看完整案例",
      cases: [
        { t: "醫療與健康服務", d: "知名醫院與醫療機構專屬包裝" },
        { t: "文化與出版傳媒", d: "大型出版集團高端文化禮品袋" },
        { t: "農特產品與高端禮贈", d: "傳統名貴食材客製手提袋" }
      ],
      
      craftTitle: "材質與工藝選擇",
      craftTag: "細節與品質體現",
      crafts: [
        { n: "優質牛皮紙體系", d: "以原木漿為主的長纖維紙張，提供出色的抗拉拽能力與溫潤的原生觸感。" },
        { n: "高克重白卡/黑卡紙", d: "使用高克重卡紙，讓紙袋的側折線更加清晰銳利，整體結構筆挺高端。" },
        { n: "精密燙印與特殊表面", d: "掌握壓紋、燙金、滿版純色印刷等工藝，確保視覺呈現更加立體飽滿。" },
        { n: "多樣化提手配置", d: "從基礎的紙繩、扁平棉繩，到客製螺紋帶、絲緞帶，為您打造最舒適的手握體驗。" }
      ],
      
      whyTitle1: "選擇 Dawn Bags", whyTitle2: "的理由",
      whys: [
        { t: "標準化的打樣驗證", d: "大規模量產前，我們會提供實體結構樣板驗證或印刷色樣，讓您在最終確認前感到安心。" },
        { t: "靈活的客製選項", d: "包容各種獨特的尺寸長寬比、特殊的打孔需求以及精準的 Pantone 專色調配。" },
        { t: "穩定高效的量產能力", d: "工廠配備先進的自動化糊底和穿繩設備，大批量訂單也能保證品質的一致性與穩定的交期。" },
        { t: "堅定的永續發展路線", d: "我們支持使用 FSC 認證溯源紙材，並推廣環保大豆油墨印刷，助您落實企業的環保目標。" }
      ],
      
      flowTitle: "項目合作流程",
      flows: [
        { t: "需求溝通", d: "通過詳細溝通確認紙袋的尺寸、提繩選型、外觀設計預期及紙張克重要求。" },
        { t: "方案報價", d: "基於包裝展開面積及材料成本進行準確核算，提供極具競爭力的工廠直客指導價。" },
        { t: "確認與打樣", d: "為客戶製作1:1實物打樣（含色彩展示及承重測試），由雙方完成投產前的最終確認。" },
        { t: "量產與交付", d: "全面啟動批量化生產並包裝入庫，我們支持貨櫃整櫃與併箱等全球物流發運協助。" }
      ],
      
      susTitleH1: "致力於推動",
      susTitleH2: "永續包裝的發展",
      susSub: "從源頭追蹤造紙來源，並在生產環節中採用環保做法。我們期望透過環保包裝材料的普及，為您的品牌賦予更強的社會責任感和生態背書。",
      susList: ["FSC® 森林管理委員會認證紙源", "符合環保標準的大豆油墨印刷", "推廣全面可回收、易降解材料", "倡導使用全棉等環保可回收提手"],
      
      faqTitle: "常見問題解答",
      faqs: [
        { q: "紙袋的客製起訂量 (MOQ) 是一般是多少？", a: "常規客製紙袋通常為 1,000 個起訂。如果是手工要求度高的高級精品袋也支持更小的測單量；對於全自動機型的大批量投產，數量越多單價越有競爭力。" },
        { q: "尺寸、材質或工藝可以做到完全量身客製嗎？", a: "毫無疑問。從專屬的長寬厚比例、承重底板的厚度，到全面印刷以及提手材質（如棉繩、人字帶、紙扭繩），均能以您的品牌要求做高度客製。" },
        { q: "確版與打樣週期需要多長時間？", a: "空白版結構白樣確認需要 3-5 個工作日；如果是包含全彩印刷與特殊燙金工藝的實物彩樣，一般需要 7-10 個工作日進行準備。" },
        { q: "您公司提供的包裝材質是環保的嗎？", a: "是的。我們為客戶提供豐富的、合乎國際環保標準的紙張選擇，並堅持採用環保黏結劑和大豆油墨進行加工生產。" },
        { q: "是否支持貨物出口及全球物流運輸？", a: "支持。我們擁有常年的出口成案及包裝規範經驗，可以協助您辦理面向全球主要港口的海運與空運全套配送流程。" }
      ],
      
      ctaTitle1: "開啟您的專屬",
      ctaTitle2: "包裝客製方案",
      ctaSub: "只需向我們提供您所需的紙袋數量、大致尺寸或應用場景。我們的專業包裝人員會在收到信息後及時為您核算成本並建議合理方案。",
      ctaBtn1: "獲取詳細工廠報價",
      ctaBtn2: "聯繫我們的業務代表"
    },
    plp: {
      title: "產品展示目錄", sub: "瀏覽我們經過實際生產驗證的各類型紙質包裝袋案例與說明。",
      filter: "產品篩選", materials: "紙張材質", eco: "環保選項", sort: "產品排序", view: "查看詳情",
      catsAll: "所有產品類別", cats: ["高端精品紙袋", "商業零售紙袋", "牛皮手提袋", "特種包裝工藝", "附加輔料"],
      mats: ["原生牛皮紙", "高白卡紙", "銅版紙", "特種皮紋紙"],
      ecos: ["FSC 認證紙源", "可循環材料", "環保大豆油墨"],
      showingCount: "當前顯示產品",
      cardTag: "品牌推薦款", cardTitle: "高端精品服裝紙袋",
      cardSpec1: "FSC 高精卡紙", cardSpec2: "高密客製防滑棉繩"
    },
    pdp: {
      back: "返回產品列表", spec: "規格屬性", mat: "推薦材質", fin: "工藝及提手", moq: "基礎起訂量", lead: "參考生產週期", features: "工藝特點",
      reqQuote: "獲取同款報價", formT: "獲取具體製作成本", formS: "請提交您預期的採購數量及聯繫方式，我們會在最快的時間內向您發送詳細的價格清單。",
      mockCat: "商業品牌經典包裝",
      mockTitle: "高質感品牌零售精品袋",
      mockDesc: "採用穩定且耐壓的高克重卡紙製作，配以加固底座結實耐用。外觀優雅，非常適合作為高檔服飾、化妝品、電子科技類產品的專屬包裝載體。",
      mockMatVal: "高克重卡紙 + 承重底板加固",
      mockFinVal: "燙金工藝 + 啞光/觸感覆膜",
      mockMoqVal: "標準款 1000 個起訂",
      mockLeadVal: "排單生產約 10-15 天"
    },
    quote: {
      title: "客製需求表單", sub: "請盡可能詳細地說明您的包裝規格要求（例如具體尺寸、印刷色系），這將有助於我們更精準、快速地為您預估出廠價格。",
      s1: "基礎資訊", s2: "規格與工藝", s3: "聯絡方式",
      fname: "名字", lname: "姓氏", email: "電子信箱", phone: "聯絡電話", comp: "產品名稱", qty: "預估採購數量", msg: "專案細節與其他特殊要求", submit: "提交詢價申請",
      formB1: "確認所需大致範圍", formB2: "尺寸長寬高與用紙情況", formB3: "獲取報價的聯絡方式",
      btnBack: "上一步", btnNext: "下一步",
      opt1: "1,000 - 5,000 件", opt2: "5,000 - 20,000 件", opt3: "20,000 - 100,000 件", opt4: "100,000 件以上",
      ph: "參考示例：尺寸要求為 長400 x 高300 x 側寬150 mm。需要使用 250克棕色牛皮紙。外觀帶有單色印刷標誌，採用扭紋紙繩作為提手等...",
      doneT: "需求清單提交成功", doneS: "我們的包裝顧問已經收到您的信息，將在最短工作時間內與您團隊確認需求並給出書面的方案報價。"
    },
    footer: {
      desc: "提供堅實耐用、工藝專業的客製紙袋產品。借助規範化的加工體系與環保材質，為客戶交付體現品牌真實價值的包裝方案。",
      pTitle: "核心產品", p1: "精緻禮品袋客製", p2: "環保牛皮紙袋", p3: "高質量卡紙手提袋", p4: "常規外帶平口口袋",
      rTitle: "包裝資料指引", r1: "尺寸規格指南", r2: "常見紙張與克重推薦", r3: "提繩選用圖表", r4: "環保規範報告",
      cTitle: "公司信息", c1: "了解我們", c2: "聯繫方式", c3: "索取工廠報價", c4: "生產車間與設備",
      rights: "版權所有。由 Dawn Bags 團隊技術支持。",
      privacy: "隱私權政策", tos: "服務條款交易規章"
    }
  }
};

type Dictionary = typeof dictionaries.en;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("dawnbags_lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "zh" || savedLang === "tw")) {
      setLangState(savedLang);
    } else {
      const navigatorLang = navigator.language.toLowerCase();
      if (navigatorLang === "zh-tw" || navigatorLang === "zh-hk" || navigatorLang === "zh-hant") {
        setLangState("tw");
      } else if (!navigatorLang.includes("zh")) {
        setLangState("en");
      } else {
        setLangState("zh");
      }
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("dawnbags_lang", newLang);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
