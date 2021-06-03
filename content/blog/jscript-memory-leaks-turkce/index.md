---
title: JScript Memory Leaks, Türkçe
date: "2021-06-02T21:44:55.284Z"
description: Douglas Crockford'un JScript Memory Leaks adlı yazısının Türkçe çevirisi.
---

Bir sistem, bellek tahsisini (memory allocation) doğru bir şekilde yönetemediğinde bellek sızıntısı yaşanır. Bellek sızıntısı bir hatadır. Belirtiler düşük performans ve başarısızlık içerebilir.

Microsoft'un Internet Explorer'ı bir dizi sızıntı içerir, bunlardan en kötüsü ise JScript ile etkileşimde yaşanan bir sızıntı. Eğer bir DOM (Document Object Model) nesnesi bir JavaScript nesnesinin (event işleyen bir fonksiyon gibi) referansına sahipse, ve aynı şekilde o JavaScript nesnesi bu DOM nesnesinin referansına sahipse döngüsel bir yapı oluşuyor. Bunun kendisi başlı başına bir problem değildir. Event işleyicisine ve DOM nesnesine referanslar olmadığında, çöp toplayıcı (garbage collector) (otomatik bellek kaynak yöneticisi) her ikisini de geri alarak alanlarının tekrar tahsis edilmesine izin verir. JavaScript çöp toplayıcısı, döngüleri anlar ve bunlarla kafası karışmaz. Ancak maalesef, IE'nin DOM'u JScript tarafından yönetilmiyor. JScript, döngüleri anlamayan kendi bellek yöneticisine sahiptir ve bu nedenle kafası çok karışır. Sonuç olarak, bu tür döngüler oluştuğunda bellek geri alımı (memory reclamation) gerçekleşmez. Geri alınmayan hafızanın ise sızdırıldığı söylenir. Zamanla beraber, bu hafıza açlığına neden olabilir. Kullanılmış hücrelerle dolu bir hafıza alanında, tarayıcı açlıktan ölür.

Bu durumu bir örnekle gösterebiliriz. [queuetest1](https://www.crockford.com/javascript/memory/queuetest1.html) adlı ilk programda 10000 DOM elemanı (span) yaratacağız, ve aynı anda en son 10 tanesi hariç hepsini sileceğiz. Windows Görev Yöneticisi'nin Performans ekranını açıp çalıştırdığınızda PF (Page File) kullanımının oldukça sabit olduğunu gözlemleyeceksiniz. PF kullanımındaki değişiklikler, bellek tahsisi verimsizliğinin bir göstergesi olabilir.

Ardından [queuetest2](https://www.crockford.com/javascript/memory/queuetest2.html) adlı ikinci programını çalıştırın. queuetest1 ile aynı şeyi yapıyor, ancak ondan farklı olarak her elemana bir tıklama işleyicisi (click handler) ekliyor. FP kullanımı Mozilla ve Opera tarayıcılarında hemen hemen aynı, ancak IE'de saniyede yaklaşık bir megabayt oranında bellek sızınıtısı yaşanırken sürekli bir artış görürüz. Genellikle bu sızıntı fark edilmez. Ancak Ajax teknikleri daha fazla yaygınlaştıkça, sayfalar da daha uzun süre yerinde kaldıkça ve daha fazla değişikliğe maruz kaldıkça başarısızlıklar çoğalır.

IE işini yapamayıp döngülerin belleklerini geri tahsis edemediğinden bu işi yapmak bize düşer. Döngüleri açık bir şekilde kırarsak IE belleği geri tahsis edebilir. [Microsoft](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/IETechCol/dnwebgen/ie_leak_patterns.asp)'a göre bellek sızıntılarının nedeni closure'lardır. Bu elbette çok yanlış, ancak Microsoft'un programcılara Microsoft'un hatalarıyla nasıl başa çıkacakları konusunda çok kötü tavsiyeler vermesine yol açıyor. DOM tarafında döngüleri kırmanın kolay olduğu ortaya çıktı. Bu döngüleri JScript tarafında kırmak neredeyse imkansızdır.

Bir elemanla işimiz bittiğinde, döngüleri kırmak için bütün olay işleyicilerini (event handler) `null` yapmalıyız. Yapmamız gereken tek şey her olay işleyicisinin özelliğine (property) `null` değerini atamak. Bu çok spesifik olarak yapılabilir, ya da jenerik bir `purge` fonksiyonu yapabiliriz.

`purge` fonksiyonu bir DOM elemanına referansı argüman olarak alır. Elemanın niteliklerinde (attributes) döngüler. Herhangi bir fonksiyon bulursa, ona `null` atar. Bu, döngüyü kırar ve hafızanın geri tahsis edilmesine olanak sağlar. Ayrıca, söz konusu elemanın tüm alt elemanlarına da bakıp onların da döngülerini temizleyecektir. `purge` fonksiyonunun Mozilla ve Opera'da herhangi bir yan etkisi olmayacaktır. Ancak bu fonksiyonun IE'de olması gereklidir. `removeChild` metodu kullanılarak ya da `innerHTML` özelliği atanarak herhangi bir elemanı kaldırmadan önce `purge` fonksiyonu çağrılmalıdır.

```javascript
function purge(d) {
  var a = d.attributes, i, l, n;
  if (a) {
    for (i = a.length - 1; i >= 0; i -= 1) {
      n = a[i].name;
      if (typeof d[n] === 'function') {
        d[n] = null;
      }
    }
  }
  a = d.childNodes;
  if (a) {
    l = a.length;
    for (i = 0; i < l; i += 1) {
      purge(d.childNodes[i]);
    }
  }
}
```

Sonunda üçüncü programı, [queuetest3](https://www.crockford.com/javascript/memory/queuetest3.html) programını çalıştırıyoruz. Burada, DOM elemanları silinmeden hemen önce `purge` fonksiyonu çağrılıyor.

`attachEvent()` ile eklenen işleyicilerin bulunamayacağını ve sızdırmaya devam edeceğini unutmayın.

Güncelleme: Microsoft bu problem için bir düzeltme yayınladı: [929874](http://support.microsoft.com/kb/929874/). Tüm kullanıcılarınızın yamayı kabul ettiğinden eminseniz, o zaman artık temizlemeye (`purge` fonksiyonuyla) yapmanıza gerek yok. Ne yazık ki bunu belirlemek mümkün değildir ve bu nedenle temizleme muhtemelen IE6'nın geri kalan ürün ömrü boyunca gerekli olacaktır.

Web'in doğası böyledir. Hataları düzeltmek, hataları ortadan kaldırmaz.

---

Bu, [Douglas Crockford](http://www.crockford.com)'un [JScript Memory Leaks](https://www.crockford.com/javascript/memory/leak.html) adlı orijinal yazısının çevirisidir.
