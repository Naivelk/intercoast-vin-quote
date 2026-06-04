import { TranslationKeys } from '../types';

export const translations: { [key: string]: any } = {
  es: {
    nav: {
      services: 'Servicios',
      benefits: 'Nuestros Beneficios',
      quote: 'Cotiza tu Póliza',
      testimonials: 'Testimonios',
      callNow: 'Llámanos Ahora',
    },
    hero: {
      title: 'Tu Seguro de Auto en California, Simple y Confiable.',
      subtitle: 'Protección a tu medida con el respaldo que mereces. Obtén una cotización gratis en minutos y descubre por qué miles confían en nosotros.',
      offer: 'Descuento del 15% al cotizar en línea',
      cta: 'Cotizar Ahora Gratis',
      ctaSubtext: 'Sin compromiso. Sin tarjeta de crédito. Cotización instantánea.',
      trustBadges: {
        secure: "100% Seguro y Protegido",
        google: "4.9/5 Estrellas en Google",
        bbb: "Calificación A+ en BBB"
      },
      features: {
        secure: 'Seguridad Garantizada',
        fast: 'Respuesta en 2 Minutos',
        easy: 'Proceso Sencillo'
      }
    },
    policies: {
      badge: 'Pólizas de Seguros',
      title: 'Soluciones a tu Medida',
      subtitle: 'Ofrecemos una amplia gama de seguros para proteger lo que más te importa. Compara y elige la mejor opción para ti.',
      cards: {
        auto: {
          title: 'Seguro de Auto',
          description: 'Protección completa para tu vehículo, estés donde estés.',
          coverageType: ['Cobertura Total', 'Daños a Terceros', 'Asistencia Vial'],
          coverages: [
            'Daños materiales a tu vehículo por colisión o vuelco',
            'Robo total del vehículo',
            'Lesiones a ocupantes y terceros',
            'Asistencia legal y grúa',
          ],
          benefits: [
            'Viaja con la tranquilidad de estar siempre protegido',
            'Red de talleres certificados para reparaciones',
            'Auto sustituto en caso de robo o pérdida total',
          ],
        },
        home: {
          title: 'Seguro de Hogar',
          description: 'La seguridad que tu hogar y tus bienes necesitan.',
          coverageType: ['Cobertura Integral', 'Responsabilidad Civil', 'Daños Materiales'],
          coverages: [
            'Daños por incendio, inundación o desastres naturales',
            'Rotura de cristales, tuberías y daños eléctricos',
            'Robo de contenidos y bienes personales',
            'Responsabilidad civil por daños a terceros',
            'Asistencia domiciliaria (cerrajería, plomería)',
          ],
          benefits: [
            'Tu hogar y tus bienes, siempre seguros',
            'Protección del hogar y todo lo que contiene',
            'Opciones con y sin deducible',
          ],
        },
        motorcycle: {
          title: 'Seguro de Moto',
          description: 'Asegura tus viajes y recorridos en dos ruedas.',
          coverageType: ['Cobertura Básica', 'Robo Total', 'Asistencia en Ruta'],
          coverages: [
            'Daños a tu moto en caso de accidente o caída',
            'Daños a terceros y sus bienes',
            'Cobertura médica al conductor',
            'Asistencia en ruta y reparación',
            'Robo total o parcial',
          ],
          benefits: [
            'Protege tus recorridos diarios y de fin de semana',
            'Ahorro en reparaciones y responsabilidad legal',
            'Ideal para motos deportivas o de uso personal',
          ],
        },
        boat: {
          title: 'Seguro de Barco',
          description: 'Navega con la confianza de estar siempre protegido.',
          coverageType: ['Casco Náutico', 'Responsabilidad Civil', 'Asistencia Náutica'],
          coverages: [
            'Daños físicos al barco (colisión, varada, incendio)',
            'Responsabilidad civil por lesiones a terceros',
            'Robo, vandalismo o hundimiento',
            'Remolque de emergencia',
            'Daños en muelles, rampas o durante transporte',
          ],
          benefits: [
            'Navega con seguridad y confianza',
            'Cobertura tanto en el agua como fuera de ella',
            'Ideal para embarcaciones recreativas, jetskis, y lanchas',
          ],
        },
      },
    },
    benefits: {
      badge: 'Nuestros Beneficios',
      title: 'Seguridad y Confianza a tu Alcance',
      subtitle: 'Descubre por qué somos la mejor opción para proteger lo que más te importa. Ofrecemos más que un seguro, te damos tranquilidad.',
      note: 'Las imágenes son referenciales y pueden variar según la póliza contratada.',
      card1: {
        title: 'Cobertura Total Garantizada',
        description: 'Nuestras pólizas están diseñadas para ofrecerte la máxima protección ante cualquier imprevisto, desde colisiones hasta desastres naturales.',
        features: [
          'Asistencia en carretera 24/7',
          'Cobertura de gastos médicos',
          'Protección contra robo total o parcial',
          'Defensa legal y asesoría'
        ]
      },
      card2: {
        title: 'Rapidez y Eficiencia Digital',
        description: 'Contrata y gestiona tu póliza de forma 100% online, sin papeleos ni complicaciones. Tu tiempo es valioso, y nosotros lo respetamos.',
        features: [
          'Cotización en menos de 2 minutos',
          'Emisión de póliza inmediata',
          'App móvil para gestionar tu seguro',
          'Notificaciones y alertas en tiempo real'
        ]
      },
      card3: {
        title: 'Atención Humana y Personalizada',
        description: 'Creemos en el poder de una buena conversación. Nuestros asesores expertos están siempre disponibles para ayudarte a resolver tus dudas.',
        features: [
          'Asesor personal asignado',
          'Línea de atención exclusiva',
          'Soporte en proceso de reclamación',
          'Consultas ilimitadas sin costo'
        ]
      }
    },
    quoteForm: {
      title: 'Cotiza tu póliza de auto',
      subtitle: 'Recibe un estimado inmediato basado en tu información',
      vinLabel: 'VIN (Número de Identificación Vehicular)',
      vinPlaceholder: 'Ingresa el VIN de 17 caracteres',
      nameLabel: 'Nombre completo (como en su licencia o ID):',
      namePlaceholder: 'Nombre completo',
      birthLabel: 'Fecha de nacimiento (MM/DD/AAAA):',
      emailLabel: 'Correo electrónico:',
      emailPlaceholder: 'correo@ejemplo.com',
      phoneLabel: 'Teléfono:',
      phonePlaceholder: '(123) 456-7890',
      addressLabel: 'Dirección',
      addressPlaceholder: 'Calle, Ciudad, Estado, Código Postal',
      numberOfVehiclesLabel: "¿Cuántos vehículos deseas cotizar?",
      numberOfVehiclesOptions: [
        "1 vehículo",
        "2 vehículos",
        "3 vehículos",
        "4 vehículos",
        "5 vehículos"
      ],
      submitButton: 'Obtener cotización',
      idLabel: 'Número de Licencia o ID',
      idPlaceholder: 'Ingresa el número de tu licencia o ID',
      cta: 'Cotizar Ahora',
      disclaimer: 'Este es un precio estimado y puede variar. Un agente se comunicará contigo para finalizar la cotización.',
      resultTitle: '¡Cotiza tu póliza en segundos!',
      vehicleSingular: 'vehículo',
      vehiclePlural: 'vehículos',
      discountTitle: '¡Descuento aplicado!',
      discountDesc: 'Por hacer su cotización online con INTERCOAST INSURANCE.',
      totalLabel: 'Total estimado mensual:',
      includedVehicles: 'Vehículos incluidos en esta cotización:',
      typeLabel: 'Tipo:',
      fuelLabel: 'Combustible:',
      hpLabel: 'HP:',
      seatsLabel: 'Asientos:',
      doorsLabel: 'Puertas:',
      individualEstimateLabel: 'Estimado individual:',
      promoMessage: '¡Presentando esta cotización tienes un 15% de descuento en tu primer mes!',
      termsMessage: 'Aplica términos y condiciones.',
      estimateDisclaimer: 'Este es un precio estimado. El precio real puede variar según la cobertura seleccionada y el historial del conductor.',
      contactMessage: '✔️ Cotización guardada. Un asesor te contactará pronto.',
      loading: 'Procesando...',
      steps: [
        'Completa el formulario',
        'Revisa tu cotización',
        '¡Protege tu auto!'
      ],
      whyChooseUs: {
        title: '¿Por qué elegirnos?',
        points: [
          'Más de 10 años de experiencia en el mercado',
          'Atención personalizada 24/7',
          'Las mejores coberturas al mejor precio',
          'Proceso de reclamación rápido y sencillo',
          'Agentes expertos a tu disposición'
        ]
      }
    },
    policyModal: {
      includedCoverages: 'Coberturas Incluidas',
      keyBenefits: 'Beneficios Clave',
      auto: {
        alt1: 'Auto asegurado en la ciudad',
        alt2: 'Conducción segura en carretera',
        alt3: 'Interior de un vehículo moderno'
      },
      home: {
        alt1: 'Hogar protegido por un seguro',
        alt2: 'Familia disfrutando de su casa segura',
        alt3: 'Interior de una casa moderna y segura',
        alt4: 'Llaves de una casa nueva'
      },
      motorcycle: {
        alt1: 'Motocicleta asegurada en la carretera',
        alt2: 'Conductor de motocicleta con casco',
        alt3: 'Motocicleta estacionada de forma segura',
        alt4: 'Viaje en motocicleta por un paisaje escénico'
      },
      boat: {
        alt1: 'Barco asegurado navegando en el mar',
        alt2: 'Navegación segura y tranquila',
        alt3: 'Barco anclado en un muelle seguro'
      }
    },
    home: {
      benefits: {
        card1: {
          title: 'Cobertura Total Garantizada',
          description: 'Máxima protección contra cualquier imprevisto, desde colisiones hasta desastres naturales.'
        },
        card2: {
          title: 'Rapidez y Eficiencia Digital',
          description: 'Contrata y gestiona tu póliza 100% en línea, sin papeleos ni complicaciones.'
        },
        card3: {
          title: 'Servicio de Asistencia 24/7',
          description: 'Servicio de emergencia disponible las 24 horas del día.'
        },
        card4: {
          title: 'Seguridad Digital',
          description: 'Tus datos y pólizas están siempre protegidos con tecnología de punta.'
        },
        card5: {
          title: 'Atención Humana y Personalizada',
          description: 'Nuestros asesores expertos están siempre disponibles para ayudarte a resolver tus dudas.'
        }
      },
      whyChooseUs: {
        title: '¿Por qué elegirnos?',
        points: [
          'Más de 10 años de experiencia en el mercado',
          'Atención personalizada 24/7',
          'Las mejores coberturas al mejor precio',
          'Proceso de reclamación rápido y sencillo',
          'Agentes expertos a tu disposición'
        ]
      },
      trust: {
        title: 'Confianza y Transparencia Garantizadas',
        subtitle: 'En InterCoast, tu tranquilidad es nuestra prioridad. Por eso, operamos con los más altos estándares de seguridad y confianza, respaldados por años de experiencia y la satisfacción de nuestros clientes.',
        items: {
          license: {
            title: 'Licencia Oficial',
            subtitle: 'Operamos con todas las licencias requeridas.'
          },
          clients: {
            title: 'Clientes Satisfechos',
            subtitle: 'Miles de clientes confían en nosotros.'
          },
          experience: {
            title: 'Años de Experiencia',
            subtitle: 'Más de una década en el sector.'
          }
        }
      }
    },
    contact: {
      title: 'Contáctanos',
      subtitle: 'Estamos aquí para ayudarte. Elige tu método de contacto preferido.',
      callTitle: 'Llámanos',
      callText: 'Nuestros agentes están listos para atenderte.',
      whatsappTitle: 'Escríbenos por WhatsApp',
      whatsappText: 'Inicia una conversación y te responderemos en minutos.',
      whatsappCta: 'Enviar Mensaje'
    },
    testimonials: {
      title: 'Lo que dicen nuestros clientes',
      subtitle: 'La confianza de nuestros clientes es nuestro mayor respaldo.',
      review1: 'Excelente servicio y atención. Resolvieron todas mis dudas y me ofrecieron la mejor cobertura para mi auto. ¡Totalmente recomendados!',
      client1: 'Maria G.',
      review2: 'El proceso fue increíblemente rápido y sencillo. Pude asegurar mi casa desde la comodidad de mi hogar. ¡Gracias, InterCoast!',
      client2: 'Carlos R.'
    },
    footer: {
      tagline: 'Tu seguridad, nuestra prioridad.',
      leaveReview: 'Déjanos una reseña',
      navTitle: 'Navegación',
      navBenefits: 'Beneficios',
      navQuote: 'Cotizar',
      navContact: 'Contacto',
      navPrivacy: 'Aviso de Privacidad',
      contact: 'Contacto',
      address: '5863 Imperial Hwy, South Gate, CA 90280 | 920 N LONG BEACH BLVD, COMPTON, CA 90221',
      phone1: 'Oficina: (562) 381-2012',
      phone2: 'Oficina: (562) 408-0620',
      whatsapp: 'WhatsApp: (562) 381-2012',
      followUs: 'Síguenos',
      paymentTitle: 'Métodos de Pago',
      creditCards: 'Tarjetas de Crédito',
      cash: 'Efectivo',
      zelle: 'Zelle',
      license: 'Licencia #123456789',
      bbbRating: 'Calificación A+ en BBB',
      copyright: '©',
      allRightsReserved: 'Todos los derechos reservados.',
      termsOfService: 'Términos de Servicio'
    },
    common: {
      close: 'Cerrar',
      viewDetails: 'Ver Detalles'
    }
  },
  en: {
    nav: {
      services: 'Services',
      benefits: 'Our Benefits',
      quote: 'Get a Quote',
      testimonials: 'Testimonials',
      callNow: 'Call Us Now',
    },
    hero: {
      title: 'Your Auto Insurance in California, Simple and Reliable.',
      subtitle: 'Tailored protection with the support you deserve. Get a free quote in minutes and discover why thousands trust us.',
      offer: '15% discount when quoting online',
      cta: 'Get a Free Quote Now',
      ctaSubtext: 'No commitment. No credit card required. Instant quote.',
      trustBadges: {
        secure: 'Guaranteed Security',
        google: '5-Star Google Rating',
        bbb: 'BBB Accredited'
      },
      features: {
        secure: 'Guaranteed Security',
        fast: 'Response in 2 Minutes',
        easy: 'Simple Process'
      }
    },
    policies: {
      badge: 'Insurance Policies',
      title: 'Tailored Solutions',
      subtitle: 'We offer a wide range of insurance to protect what matters most to you. Compare and choose the best option for you.',
      cards: {
        auto: {
          title: 'Car Insurance',
          description: 'Complete protection for your vehicle, wherever you are.',
          coverageType: ['Total Coverage', 'Third-Party Damages', 'Roadside Assistance'],
          coverages: [
            'Material damage to your vehicle from collision or rollover',
            'Total theft of the vehicle',
            'Injuries to occupants and third parties',
            'Legal assistance and towing',
          ],
          benefits: [
            'Travel with the peace of mind of being always protected',
            'Network of certified repair shops',
            'Replacement car in case of theft or total loss',
          ],
        },
        home: {
          title: 'Home Insurance',
          description: 'The security your home and assets need.',
          coverageType: ['Comprehensive Coverage', 'Civil Liability', 'Material Damages'],
          coverages: [
            'Damage from fire, flood, or natural disasters',
            'Broken glass, pipes, and electrical damage',
            'Theft of contents and personal property',
            'Civil liability for damages to third parties',
            'Home assistance (locksmith, plumbing)',
          ],
          benefits: [
            'Your home and your assets, always safe',
            'Protection for the home and everything in it',
            'Options with and without a deductible',
          ],
        },
        motorcycle: {
          title: 'Motorcycle Insurance',
          description: 'Secure your trips and journeys on two wheels.',
          coverageType: ['Basic Coverage', 'Total Theft', 'Roadside Assistance'],
          coverages: [
            'Damage to your motorcycle in an accident or fall',
            'Damage to third parties and their property',
            'Medical coverage for the driver',
            'Roadside assistance and repair',
            'Total or partial theft',
          ],
          benefits: [
            'Protect your daily and weekend rides',
            'Savings on repairs and legal liability',
            'Ideal for sport or personal use motorcycles',
          ],
        },
        boat: {
          title: 'Boat Insurance',
          description: 'Sail with the confidence of being always protected.',
          coverageType: ['Hull Insurance', 'Civil Liability', 'Nautical Assistance'],
          coverages: [
            'Physical damage to the boat (collision, grounding, fire)',
            'Civil liability for injuries to third parties',
            'Theft, vandalism, or sinking',
            'Emergency towing',
            'Damage to docks, ramps, or during transport',
          ],
          benefits: [
            'Sail with safety and confidence',
            'Coverage both on and off the water',
            'Ideal for recreational boats, jet skis, and motorboats',
          ],
        },
      },
    },
    benefits: {
      badge: 'Our Benefits',
      title: 'Security and Confidence at Your Fingertips',
      subtitle: 'Discover why we are the best option to protect what matters most to you. We offer more than just insurance, we give you peace of mind.',
      note: 'Images are for reference and may vary depending on the policy contracted.',
      card1: {
        title: 'Total Coverage Guaranteed',
        description: 'Our policies are designed to offer you maximum protection against any unforeseen event, from collisions to natural disasters.',
        features: [
          '24/7 roadside assistance',
          'Medical expense coverage',
          'Protection against total or partial theft',
          'Legal defense and advice'
        ]
      },
      card2: {
        title: 'Digital Speed and Efficiency',
        description: 'Purchase and manage your policy 100% online, without paperwork or complications. Your time is valuable, and we respect that.',
        features: [
          'Quote in under 2 minutes',
          'Immediate policy issuance',
          'Mobile app to manage your insurance',
          'Real-time notifications and alerts'
        ]
      },
      card3: {
        title: 'Human and Personalized Attention',
        description: 'We believe in the power of a good conversation. Our expert advisors are always available to help you resolve your doubts.',
        features: [
          'Assigned personal advisor',
          'Exclusive attention line',
          'Support in the claims process',
          'Unlimited consultations at no cost'
        ]
      }
    },
    quoteForm: {
      title: 'Auto Insurance Quote',
      subtitle: 'Complete the form to receive your personalized quote',
      vinLabel: 'VIN (Vehicle Identification Number)',
      vinPlaceholder: 'Enter the 17-character VIN',
      nameLabel: 'Full Name',
      namePlaceholder: 'e.g., John Doe',
      birthLabel: 'Date of Birth',
      birthPlaceholder: 'MM/DD/YYYY',
      emailLabel: 'Email Address',
      emailPlaceholder: 'your.email@example.com',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '(123) 456-7890',
      addressLabel: 'Address',
      addressPlaceholder: 'Street, City, State, ZIP Code',
      numberOfVehiclesLabel: "Number of vehicles",
      numberOfVehiclesOptions: [
        "1 vehicle",
        "2 vehicles",
        "3 vehicles",
        "4 vehicles",
        "5 vehicles"
      ],
      submitButton: 'Get Quote',
      idLabel: 'License or ID Number',
      idPlaceholder: 'Enter your license or ID number',
      cta: 'Quote my insurance',
      disclaimer: 'This is an estimated price and may vary. An agent will contact you to finalize the quote.',
      resultTitle: 'Get your insurance quote in seconds!',
      vehicleSingular: 'vehicle',
      vehiclePlural: 'vehicles',
      discountTitle: 'Discount applied!',
      discountDesc: 'For getting your quote online with INTERCOAST INSURANCE.',
      totalLabel: 'Total estimated monthly:',
      includedVehicles: 'Vehicles included in this quote:',
      typeLabel: 'Type:',
      fuelLabel: 'Fuel:',
      hpLabel: 'HP:',
      seatsLabel: 'Seats:',
      doorsLabel: 'Doors:',
      individualEstimateLabel: 'Individual estimate:',
      promoMessage: 'By presenting this quote, you get a 15% discount on your first month!',
      termsMessage: 'Terms and conditions apply.',
      estimateDisclaimer: 'This is an estimated price. The actual price may vary depending on the selected coverage and the driver\'s history.',
      contactMessage: '✔️ Quote saved. An advisor will contact you soon.',
      loading: 'Processing...',
      steps: [
        'Complete the form',
        'Review your quote',
        'Protect your car!'
      ],
      whyChooseUs: {
        title: 'Why Choose Us?',
        points: [
          'Over 10 years of experience in the market',
          '24/7 personalized attention',
          'Best coverage at the best price',
          'Fast and easy claims process',
          'Expert agents at your service'
        ]
      }
    },
    policyModal: {
      includedCoverages: 'Included Coverages',
      keyBenefits: 'Key Benefits',
      auto: {
        alt1: 'Insured car in the city',
        alt2: 'Safe driving on the highway',
        alt3: 'Interior of a modern vehicle'
      },
      home: {
        alt1: 'Home protected by insurance',
        alt2: 'Family enjoying their safe house',
        alt3: 'Interior of a modern and safe house',
        alt4: 'Keys to a new house'
      },
      motorcycle: {
        alt1: 'Insured motorcycle on the road',
        alt2: 'Motorcycle rider with a helmet',
        alt3: 'Motorcycle parked safely',
        alt4: 'Motorcycle trip through a scenic landscape'
      },
      boat: {
        alt1: 'Insured boat sailing on the sea',
        alt2: 'Safe and calm navigation',
        alt3: 'Boat anchored at a secure dock'
      }
    },
    home: {
      benefits: {
        card1: {
          title: 'Total Coverage Guaranteed',
          description: 'Maximum protection against any unforeseen event, from collisions to natural disasters.'
        },
        card2: {
          title: 'Digital Speed and Efficiency',
          description: 'Purchase and manage your policy 100% online, without paperwork or complications.'
        },
        card3: {
          title: '24/7 Assistance Service',
          description: 'Emergency service available 24 hours a day.'
        },
        card4: {
          title: 'Digital Security',
          description: 'Your data and policies are always protected with cutting-edge technology.'
        },
        card5: {
          title: 'Human and Personalized Attention',
          description: 'Our expert advisors are always available to help you resolve your doubts.'
        }
      },
      whyChooseUs: {
        title: 'Why Choose Us?',
        points: [
          'Over 10 years of experience in the market',
          '24/7 personalized attention',
          'The best coverage at the best price',
          'Fast and easy claims process',
          'Expert agents at your service'
        ]
      },
      trust: {
        title: 'Trust and Transparency Guaranteed',
        subtitle: 'At InterCoast, your peace of mind is our priority. That is why we operate with the highest standards of security and trust, backed by years of experience and the satisfaction of our clients.',
        items: {
          license: {
            title: 'Official License',
            subtitle: 'We operate with all required licenses.'
          },
          clients: {
            title: 'Satisfied Clients',
            subtitle: 'Thousands of clients trust us.'
          },
          experience: {
            title: 'Years of Experience',
            subtitle: 'More than a decade in the sector.'
          }
        }
      }
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We are here to help you. Choose your preferred contact method.',
      callTitle: 'Call Us',
      callText: 'Our agents are ready to assist you.',
      whatsappTitle: 'Write to Us on WhatsApp',
      whatsappText: 'Start a conversation and we will respond in minutes.',
      whatsappCta: 'Send Message'
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: 'The trust of our clients is our greatest endorsement.',
      review1: 'Excellent service and attention. They resolved all my doubts and offered me the best coverage for my car. Totally recommended!',
      client1: 'Maria G.',
      review2: 'The process was incredibly fast and simple. I was able to insure my home from the comfort of my home. Thank you, InterCoast!',
      client2: 'Carlos R.'
    },
    footer: {
      tagline: 'Your safety, our priority.',
      leaveReview: 'Leave us a review',
      navTitle: 'Navigation',
      navBenefits: 'Benefits',
      navQuote: 'Get a Quote',
      navContact: 'Contact',
      navPrivacy: 'Privacy Policy',
      contact: 'Contact',
      address: '5863 Imperial Hwy, South Gate, CA 90280 | 920 N LONG BEACH BLVD, COMPTON, CA 90221',
      phone1: 'Office: (562) 381-2012',
      phone2: 'Office: (562) 408-0620',
      whatsapp: 'WhatsApp: (562) 381-2012',
      followUs: 'Follow Us',
      paymentTitle: 'Payment Methods',
      creditCards: 'Credit Cards',
      cash: 'Cash',
      zelle: 'Zelle',
      license: 'License #123456789',
      bbbRating: 'A+ Rating on BBB',
      copyright: '©',
      allRightsReserved: 'All rights reserved.',
      termsOfService: 'Terms of Service'
    },
    common: {
      close: 'Close',
      viewDetails: 'View Details'
    }
  }
};
