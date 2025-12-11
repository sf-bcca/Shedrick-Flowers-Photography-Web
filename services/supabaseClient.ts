import { createClient } from '@supabase/supabase-js';
import { PortfolioItem, BlogPost, ServiceTier } from '../types';

// Placeholder defaults. Replace these with your actual Supabase project credentials in a .env file or build settings.
// For this demo, if keys are default, we default to "Mock Mode".
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

const isMockMode = supabaseUrl === 'https://xyzcompany.supabase.co';

// --- Mock Data for Fallback ---
let mockPortfolio: PortfolioItem[] = [
    { id: '1', title: "Sarah & James", category: "Wedding", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCU-GRgsns8wUFaud9tpUVDoe-ISS_Zq5m2u63oqz41J4OtFa32YwVi9ECjip84iJ42Ad5ZOwTVkR6Kb1DUB5gToDrP99gu_kcLvIXFidcuk05oFOmOtgJaK4Olu6zGkjxNbY3D8x0egFSCjzF8-2Ys8Ru78QBsrjQy3XR3kg0jeP4mmKw4vRt4kE1KSWTPwnbVkW3V0HumKffR7g4Bdc8uA13JFerXwVDUAZMjKnviDZDJe1yG0qEykMbp9M2M7kB2WSsVAD_HQkyC" },
    { id: '2', title: "Vogue Italia", category: "Editorial", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx5vn6II72x9rLUqRVlEOOeu0Ca7l9BW1mPq7BDICEucthQPWBBvmagk12wUjQfURjniyRjq2ZkcwW9AsBgIQzNhqs-18SUvSpB2aackoNBJp_VJWIQ14vRMBk4LeFQnQR6YlEKlGb0ohmfUgjhAjTVIKvKPpCPJzVRs9qB5gCyUCq5PLUiA0CxXyKejW06d3LMYUCC3cAGGR4Q6AYr1VBuzA16lKfiap3mlTHcZa2idtV2x1C-E1g-jE-JLbYsTfet9Fw01tkQwGy", marginTop: true },
    { id: '3', title: "Urban Shadows", category: "Street", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaj3GNDHcTdHrx0tog6frdJwHhUUO2qx402JdyyxNkk2ithSvsfqc9JjTljoDNsbAhWDFq-VOfpbXOhfoZyyxexpP4aOvOryQkv41AHtxtAo_0rYpdgRyNphKd6EckNynR44ZAQKLRPPCrbTsEU6-Rhdh7kpgUOKxrAeUJRd4i8btmNshrQvnjDKMQOpTdUbxJXZQlmMPwQanzPDpnnaKEIU58hnKa65lcn-XC39zkE9K9rKJyIXmHQZQcUjoFbCzZtRDGKvCp1zAs" },
    { id: '4', title: "Desert Bloom", category: "Fashion", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASpZNvHJuPZwmODHg867Mi0fG1YM3TH91bbKjMjkz4rtgKSyFxsRjeKW6iurRrkOvHR5M3ynz760PyR_AKFlpXZDnkpJx9HVKYghbyIHtVpS615hghMlHccHnNiU6j160cAISIMucBnKg_9zaUaFC779B0Sx1X0h8aJOXICZNrhgwiIy37klWmE7442vmGGuEcd2dxe7PKiOcyL_IO0ET19Lz-hqPu7-FEM_gfP38tjk2G6ZYLqA8Wi_3dT6RalYgW_KeyEsVJjwit", marginTopInverse: true },
    { id: '5', title: "The Andersons", category: "Lifestyle", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2_HmFxEpRY12XdjgeZuNL2vLwftaxbtBkmOx9HZI3xzbCbC86lVaaQtZUQ8NnCE3jPWOWWwF77MeyTLRzX8qkXwhXe73aFMEGlEQJuXRLp94n910iAQ96HxJdONFBNUnhuzq5gk6__5ovvjJFs9i8GxKCMmR028LQ9E_8QBaaCc8d1Trrf71s3-tS-IYMwuCTAs4aygE8m1xfokwQboG3PTBoOnt4vtDfgE9ncZ-gDQmEGqsGmkh082v7f7gGGPqvR4T-gt3I-LlL" },
    { id: '6', title: "Modern Lines", category: "Architecture", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp5CCljNePTnvquZUEs4lNu0ZCFr-F-Ifi_gcaacDki7JkSKoHEPLhjJgiWuOCclPzwzuYe1wrbVlhI1B4HOH6kMCoNvzaTmbwzzJEZDOSFWO0oJCYSKBXYuWHkfDw-uEiJl2898cu5N8NoP-ERkW3Qo0YhSR4p-3KRIq6MPTrf8gwQx2F6lk13fqEnXb5fwf4atzCn3fTYXrGUAfBTNL5R9vcYckiuED26px3gHxWQOWtRw3qJxbshx8yOOxceU5S2HrLXb3aieH2", marginTop: true }
];

let mockBlog: BlogPost[] = [
    { id: '1', title: "Lighting 101: Mastering the Golden Hour", category: "Tutorials", date: "Oct 24, 2023", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIWzhnRN9sZ9ebSCWpSooNiv_hcEHSFIcgWaKA_3GlO8ezsFH5m3kZw3-w1PAIIuDAo5Q8xQu7NY-VXSIDYfE6krLQLbOOsWEV9nwweCfJD4lt0v4Qs_jLRlM_m71WDkmxYujoVJspz_mhiMDx4FpOOoEeMMzlsrD17Toq-Y-YKjMoDR2qQojs8pOJMC4Ep9CDFIpVORDD3LavF8FSIxQZkFVn2Eg7fAIMItIgF701D2UU7EfSN4S9XJlwhxLhdg2a-sZYscTVqJaQ", excerpt: "Understanding natural light is the key to cinematic photography." },
    { id: '2', title: "Sony vs. Canon: My 2024 Field Review", category: "Gear", date: "Oct 10, 2023", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5L-5D-RQOtFcx7gEag0wPihL9EIHx11pYNRGpH-lzfQVy1HMGDsiU2Kt9FumU_kkrGsPenxgNxscN4GhSU9Jlk92dHeGSfYqljvfipCfK1mI9C55XnfsHfJz53sGmsY0jRRHh5BonNYGIqOvcscZ_gFiLiyLWzrOOscDWQGTM1loF1IQk-D1sZChJpMr5gmbgIv7Kpfmhtq39VS7yKs5Jfg1SgLWqavu2sXclLCtSzGATIUSpF7ulU9JKcd53xzYMbsjFhJQ1DMxt", excerpt: "A deep dive into the mirrorless war." }
];

let mockServices: ServiceTier[] = [
    { id: '1', title: "Wedding & Engagement", price: "2,400", description: "Cinematic storytelling of your special day.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPMDR4fm7B70g0kaB1mRo2lOoh9kQTUQ9D96y6-A2J4ZOd71vItBdokdoJoFiCo-RecVKuBpTanC7d_YT15NuRc2sAuyDnr-ZhfgtNSPzgXG52tni12D38z9hb2CfKfs_pdjQl--wJmkbB-dvpQ4r48JBeDxlq--PMqBkx_BcREUGDFWRzdj3V64rxatUDlTufzRA-QeTZnhVSvFu8EVFG3SdFJK6xYx222mHje2mOVAWGUNDzAqwM51Xxuic8geHkjD6JrEhmQR-U" },
    { id: '2', title: "Portraiture", price: "350", description: "Studio or outdoor sessions designed to highlight your personality.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhgYkLov4j_919B7CnNyljj0jdHodcenyplJoHpcm5uJeqP6HorhyDer3sPW0MZQp5PdSujU230kVsepM67Dr53y01GgKIlJ3kUUgFqxteuM2NWxdCwdXxVrMXw32UTOqDK9PO_S8GliFiomM_8pNwbDWwxKpPOkma4RTlEasEreoo922K-L1LUGGxXmx2TtPdii0hrDlW0lc7bGBGzNi7n0qJRxIHi93H45KD4esofFNYgApGSOKjr2v59QHcDO3V1d96bAaFjvWm" },
    { id: '3', title: "Commercial", price: "Custom", description: "Elevate your brand identity with high-quality visual assets.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9ZQGzLs2rCcrZ6WoFtcbl9fpxzioH3c9PzxoIj76OVu7iwJR_n3Dh1pfypezGG8sITYJgUcbVvZhBd06XSPkWhAZUR-69jLy_Z-ZiEbD8UVwUtKAS7VrRi2ffgEF1NSeRXdtSiMnkYvvTUm2JIFlDilhb0WEZins847Ar3WaqgYeyiQTcXppDASce5jbswtvVUYmDIp1SmB79QAucO1sLaCZu8ppRmpzH89H8jni5eU65VhVv6lmxdChiC7RNm3lCG759fIODUVEW" }
];

// --- Generic CRUD Wrappers ---

export const fetchData = async (table: 'portfolio' | 'blog' | 'services') => {
    if (isMockMode) {
        // Simulate network
        await new Promise(r => setTimeout(r, 400));
        if (table === 'portfolio') return [...mockPortfolio];
        if (table === 'blog') return [...mockBlog];
        if (table === 'services') return [...mockServices];
        return [];
    }

    const { data, error } = await supabase.from(table).select('*');
    if (error) {
        console.error(`Error fetching ${table}:`, error);
        return [];
    }
    return data;
};

export const createItem = async (table: 'portfolio' | 'blog' | 'services', item: any) => {
    if (isMockMode) {
        await new Promise(r => setTimeout(r, 400));
        const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
        if (table === 'portfolio') mockPortfolio.push(newItem);
        if (table === 'blog') mockBlog.push(newItem);
        if (table === 'services') mockServices.push(newItem);
        return { data: [newItem], error: null };
    }

    // Remove ID if present to let DB auto-increment or gen UUID
    const { id, ...dataToInsert } = item;
    return await supabase.from(table).insert([dataToInsert]).select();
};

export const updateItem = async (table: 'portfolio' | 'blog' | 'services', id: string, updates: any) => {
    if (isMockMode) {
        await new Promise(r => setTimeout(r, 400));
        if (table === 'portfolio') mockPortfolio = mockPortfolio.map(i => i.id === id ? { ...i, ...updates } : i);
        if (table === 'blog') mockBlog = mockBlog.map(i => i.id === id ? { ...i, ...updates } : i);
        if (table === 'services') mockServices = mockServices.map(i => i.id === id ? { ...i, ...updates } : i);
        return { error: null };
    }

    return await supabase.from(table).update(updates).eq('id', id);
};

export const deleteItem = async (table: 'portfolio' | 'blog' | 'services', id: string) => {
    if (isMockMode) {
        await new Promise(r => setTimeout(r, 400));
        if (table === 'portfolio') mockPortfolio = mockPortfolio.filter(i => i.id !== id);
        if (table === 'blog') mockBlog = mockBlog.filter(i => i.id !== id);
        if (table === 'services') mockServices = mockServices.filter(i => i.id !== id);
        return { error: null };
    }

    return await supabase.from(table).delete().eq('id', id);
};
