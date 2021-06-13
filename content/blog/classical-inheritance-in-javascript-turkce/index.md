---
title: Classical Inheritance in JavaScript, Türkçe
date: "2021-06-06T06:45:55.284Z"
description: Douglas Crockford'un Classical Inheritance in JavaScript adlı yazısının Türkçe çevirisi.
---

And you think you're so clever and classless and free. — John Lennon

[JavaScript](http://www.crockford.com/javascript), sınıfsız, nesne yönelimli bir dildir ve bu nedenden dolayı klasik kalıtım (classical inheritance) yerine prototip kalıtımı kullanır. Bu, C++ ve Java gibi geleneksel nesne yönelimli dillere alışkın programcılar için kafa karıştırıcı olabilir. JavaScript'in prototip kalıtımı, birazdan göreceğimiz gibi, klasik kalıtımdan daha fazla ifade gücüne sahiptir.

Ama öncelikle, kalıtım konusunu niye önsemsiyoruz ki? Her şeyden önce bunun iki nedeni var. Birincisi tip konusunda sağlanan kolaylıktır. Dil sisteminin benzer sınıfların referanslarını otomatik olarak yaymasını (*cast*) istiyoruz. Nesne referanslarının tip çevirimlerini açık (explicit) ve rutin bir şekilde gerektiren bir tip sistemi çok zayıf bir tip-güvenliği sağlar. Bu durum sıkı-tipli dillerde kritik öneme sahiptir, fakat nesne referanslarının çevirimlere ihtiyaç duymadığı JavaScript gibi serbest-tipli dillerde bunun önemi yoktur.

| Java                        | JavaScript                    
|-----------------------------|-------------------------------
| Sıkı-tipli (Strongly-typed) | Serbest-tipli (Loosely-typed)
| Statik                      | Dinamik
| Klasik                      | Prototip
| Sınıflar                    | Fonksiyonlar
| Yapıcılar (Constructor)     | Fonksiyonlar
| Metodlar                    | Fonksiyonlar

İkinci neden kodun yeniden kullanılabilir olması. Tamamen aynı metodları uygulayan çok sayıda nesneye sahip olmak oldukça yaygındır. Sınıflar, hepsini tek bir tanım kümesinden oluşturabilmeyi sağlar. Bazı diğer nesnelere benzeyen, ancak sadece az sayıda metodun eklenmesi veya değiştirilmesinde farklılık gösteren nesnelere sahip olmak da yaygındır. Klasik kalıtım bunun için yararlıdır, ancak prototip kalıtım daha da yararlıdır.

Bunu göstermek için, geleneksel bir klasik dile benzeyen bir tarzda yazmamıza izin verecek bir [sugar (örnek)](#sugar) (yazar burada "syntactic sugar" referansı veriyor) kullanacağız.

### <a name="klasik-kalıtım"></a>Klasik Kalıtım (Classical Inheritance)

İlk olarak, `value` değişkeni için `set` ve `get` metodları ve `value` değerini parantezlerle saracak `toString` metodu olan bir `Parenizor` sınıfı oluşturacağız.

```javascript
function Parenizor(value) {
  this.setValue(value);
}

Parenizor.method('setValue', function (value) {
  this.value = value;
  return this;
});

Parenizor.method('getValue', function () {
  return this.value;
});

Parenizor.method('toString', function () {
  return '(' + this.getValue() + ')';
});
```

Bu sözdilimi biraz garip gelebilir, ancak içindeki klasik kalıbın (classical pattern) farkına kolayca varılabilir. `method` metodu, bir metot ismi ve fonksiyon alıp sınıfa genel metot olarak ekler.

Bu şekilde yazabiliriz:

```javascript
myParenizor = new Parenizor(0);
myString = myParenizor.toString();
```

Tahmin edeceğiniz gibi, `myString` değişkeninin değeri `"(0)"` olacak.

Şimdi, `Parenizor` sınıfından kalıt alacak (inherit) başka bir sınıf oluşturacağız, tek farkı ise `value` sıfır veya boş olduğunda `toString` metodu `"-0-"` değerini dönecek.

```javascript
function ZParenizor(value) {
  this.setValue(value);
}

ZParenizor.inherits(Parenizor);

ZParenizor.method('toString', function () {
  if (this.getValue()) {
    return this.uber('toString');
  }
  return "-0-";
});
```

Buradaki `inherits` metodu Java'daki `extends` ifadesine benzer. `uber` metodu ise Java'nın `super` metoduna benzer. Bir metodun üst sınıfın bir metodunu çağırmasına izin verir. (Rezerve edilmiş kelime kısıtlamalarını önlemek için isimler değiştirilmiştir.)

Bu şekilde kullanabiliriz:

```javascript
myZParenizor = new ZParenizor(0);
myString = myZParenizor.toString();
```

Bu sefer ise, `myString` değişkeninin değeri `"-0-"` olacak.

JavaScript'te sınıflar yoktur, ancak varmış gibi programlayabiliriz.

### Çoklu Kalıtım (Multiple Inheritance)

Bir fonksiyonun `prototype` nesnesini manipüle ederek birden çok sınıfın metodlarından oluşturulmuş bir sınıf oluşturmamıza izin veren çoklu kalıtımı uygulayabiliriz. Karışık çoklu kalıtımı uygulamak zor olabilir ve potansiyel olarak metot ismi çakışmalarına maruz kalınabilir. JavaScript'te karışık çoklu kalıtımı uygulayabiliriz, ancak bu örnek için [Swiss Inheritance](http://www.cosmik.com/aa-october99/stan_freberg.html) adında daha disiplinli bir yapı kullanacağız.

`value` değişkeninin belirli bir aralıkta bir sayı olup olmadığını kontrol eden `setValue` metoduna sahip, gerekirse exception fırlatan bir `NumberValue` sınıfı olduğunu varsayalım. `ZParenizor` sınıfımız için sadece `setValue` ve `setRange` metodlarını istiyoruz. Kesinlikle onun `toString` metodunu istemiyoruz. Bu şekilde yazacağız:

```javascript
ZParenizor.swiss(NumberValue, 'setValue', 'setRange');
```

Bu yalnızca istenen metodları sınıfımıza ekler.

### Parazit Kalıtım (Parasitic Inheritance)

`ZParenizor` sınıfını yazabileceğimiz başka bir yol daha var. `Parenizor` sınıfından kalıt almak yerine, `Parenizor` yapıcısını (constructor) çağıran ve sonucu kendisininki gibi aktaran bir yapıcı yazıyoruz. Ve yapıcı, genel metodlar eklemek yerine, [ayrıcalıklı metodlar](http://www.crockford.com/javascript/private.html) ekler.


```javascript
function ZParenizor2(value) {
  var that = new Parenizor(value);
  that.toString = function () {
    if (this.getValue()) {
      return this.uber('toString');
    }
    return "-0-"
  };
  return that;
}
```

Klasik kalıtımda [*is-a*](https://en.wikipedia.org/wiki/Is-a) ilişkisi var, ve parazit kalıtımda ise *[was-a-but-now's-a](#was-a-but-nows-a)* ilişkisi var. Nesnenin yapımında yapıcının daha büyük bir rolü vardır. `super` metodunun karşılığı olan `uber` metodunun ayrıcalıklı metodlar için hala erişilebilir olduğunu görebilirsiniz.

### Sınıf Çoğaltması (Class Augmentation)

JavaScript'in dinamizmi, mevcut bir sınıfın metodlarına ekleme veya değiştirme yapmamıza izin verir. `method` metodunu istediğimiz zaman çağırabiliriz, ve sınıfın mevcut ve gelecekteki tüm örnekleri (instance) bu metoda sahip olacaktır. Kelimenin tam anlamıyla herhangi bir zamanda bir sınıfı genişletebiliriz. Kalıtım geriye dönük olarak çalışır. Başka bir anlama gelen Java'nın `extends` ifadesiyle karıştırmamak için buna *Sınıf Çoğaltması* diyoruz.

### Nesne Çoğaltması (Object Augmentation)

Statik nesne-yönelimli dillerde, başka bir nesneden biraz farklı bir nesne istiyorsanız, yeni bir sınıf tanımlamanız gerekir. JavaScript'te, ek sınıflara ihtiyaç duymadan ayrı nesnelere metodlar ekleyebilirsiniz. Bunun muazzam bir gücü var çünkü çok daha az sınıf yazabilirsiniz ve yazdığınız sınıflar ise çok daha basit olabilir. JavaScript nesnelerinin hashtable gibi olduklarını hatırlayın. Yeni değerleri istediğiniz zaman ekleyebilirsiniz. Eğer verilen değer bir fonksiyon ise, bu metoda dönüşür.

Yani yukarıdaki örnekte bir `ZParenizor` sınıfına hiç ihtiyacım yoktu. Basit bir şekilde örneğimi değiştirebilirdim.

```javascript
myParenizor = new Parenizor(0);
myParenizor.toString = function () {
  if (this.getValue()) {
    return this.uber('toString');
  }
  return "-0-";
};
myString = myParenizor.toString();
```

Kalıtımın herhangi bir formunu kullanmadan `myParenizor` örneğimize bir `toString` metodu ekledik.

### <a name="sugar"></a>Sugar

Yukarıdaki örneklerin işe yaraması için dört tane [sugar (örnek)](http://en.wikipedia.org/wiki/Syntactic_sugar) metodu yazdım. İlk olarak, bir sınıfa örnek (instance) metodu ekleyen bir `method` metodu:

```javascript
Function.prototype.method = function (name, func) {
  this.prototype[name] = func;
  return this;
};
```

Bu, `Function.prototype` nesnesine bir genel metot ekler ve böylelikle Sınıf Çoğaltmasıyla bütün fonksiyonlar ona erişebilecekler. Bir isim ve fonksiyon alıp, bir fonksiyonun `prototype` nesnesine ekler. Ve `this` döndürür. Herhangi bir değer döndürmesi gerekmeyen bir metot yazdığımda, genellikle `this` döndürmesini sağlarım. Bu, kademeli (cascade-style) bir programlama tarzına izin verir.

Sırada ise bir sınıfın başka sınıftan geldiğini gösteren `inherits` metodu var. Her iki sınıf da tanımlandıktan sonra çağrılmalıdır, fakat kalıtım alınan sınıfın metodları eklenmeden önce çağrılmalıdır.

```javascript
Function.method('inherits', function (parent) {
  this.prototype = new parent();
  var d = {}, 
    p = this.prototype;
  this.prototype.constructor = parent; 
  this.method('uber', function uber(name) {
    if (!(name in d)) {
      d[name] = 0;
    }        
    var f, r, t = d[name], v = parent.prototype;
    if (t) {
      while (t) {
        v = v.constructor.prototype;
        t -= 1;
      }
      f = v[name];
    } else {
      f = p[name];
      if (f == this[name]) {
        f = v[name];
      }
    }
    d[name] += 1;
    r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
    d[name] -= 1;
    return r;
  });
  return this;
});
```

Tekrar belirtmek adına, burada `Function` fonksiyonunu çoğaltıyoruz. `parent` sınıfının bir örneğini oluşturup yeni `prototype` olarak kullanıyoruz. `constructor` alanına da kalıtım alınacak `parent` sınıfını atayarak düzeltiyoruz, ve `prototype` nesnesine de `uber` metodunu ekliyoruz.

`uber` metodu parametre olarak verilen isimli metodu kendi `prototype` nesnesinde arıyor. Bu fonksiyon, Parazit Kalıtım veya Nesne Çoğaltması örnekleri için çağrılır. Eğer Klasik Kalıtım yapıyorsak, fonksiyonu `parent` sınıfının `prototype` nesnesinde bulmamız gerekiyor. `return` ifadesi, fonksiyonu çalıştırmak için açık olarak (explicit) `this`'i belirleyip parametre dizisini geçerek fonksiyonun `apply` metodunu kullanır. Parametreler (eğer var ise) `arguments` dizisinden alınır. Ne yazık ki `arguments` gerçek bir dizi (array) olmadığından, dizinin `slice` metodunu çalıştırabilmek için `apply` metodunu tekrar kullanmak zorundayız.

Son olarak, `Swiss` metodu:

```javascript
Function.method('swiss', function (parent) {
  for (var i = 1; i < arguments.length; i += 1) {
    var name = arguments[i];
    this.prototype[name] = parent.prototype[name];
  }
  return this;
});
```

`Swiss` metodu `arguments` dizisini döngüler. Her bir `name` için `parent` sınıfının `prototype` nesnesinden yeni sınıfın `prototype` nesnesine bir üye kopyalar.

### Sonuç

JavaScript klasik bir dil gibi kullanılabilir, ancak aynı zamanda oldukça benzersiz bir ifade düzeyine sahiptir. Klasik Kalıtıma, Swiss Kalıtıma, Parazit Kalıtıma, Sınıf ve Nesne Çoğaltmasına baktık. Bu büyük yeniden kod kullanım kalıpları seti, Java'dan daha basit ve küçük olarak görülen bir dilden geliyor.

Klasik nesneler serttir. Sert bir nesneye yeni bir üye eklemenin tek yolu yeni bir sınıf oluşturmaktır. JavaScript'te nesneler yumuşaktır. Basit bir atama ile yumuşak bir nesneye yeni bir üye eklenebilir. 

JavaScript'teki nesneler çok esnek olduğundan, sınıf hiyerarşileri hakkında farklı düşünmek isteyeceksiniz. Derin hiyerarşiler uygun değildir. Yüzeysel hiyerarşiler ise etkili ve anlamlıdır.

##### <a name="was-a-but-nows-a"></a>was-a-but-now's-a
Yazar parazit kalıtım için *was-a-but-now's-a* örneğini klasik kalıtımın *is-a* örneğinden yola çıkarak bir kelime oyunu yapmıştır. Özet olarak *is-a*, A sınıfının B sınıfından kalıt (inherit) alarak bir alt sınıfı olması, ve dolayısıyla B sınıfının A sınıfınının "supperclass"'ı olması olarak açıklanabilir. *was-a-but-now's-a* ise, A sınıfının B sınıfından kalıt (inherit) almak yerine, B sınıfının yapıcısını çağırarak sonucu A sınıfının bir metodunun sonucu gibi aktarılması olarak açıklanabilir.

---

Bu, [Douglas Crockford](http://www.crockford.com)'un [Classical Inheritance in JavaScript](https://www.crockford.com/javascript/inheritance.html) adlı orijinal yazısının çevirisidir.
