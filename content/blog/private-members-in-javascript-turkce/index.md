---
title: Private Members in JavaScript, Türkçe
date: "2021-06-10T22:50:55.284Z"
description: Douglas Crockford'un Private Members in JavaScript adlı yazısının Türkçe çevirisi.
isTranslation: true
---

[JavaScript](https://www.crockford.com/javascript) dünyanın en yanlış anlaşılan programlama dilidir. Nesnelerin özel örnek (instance) değişkenlerine ve metodlarına sahip olamayacağı için *bilgi gizleme* özelliğinden yoksun olduğuna inanılıyor. Ama bu bir yanlış anlaşılmadır. JavaScript nesneleri özel üyelere (private member) sahip olabilir. Bu şekilde gösterebiliriz:

### Nesneler

JavaScript'in temeli *nesnelerdir*. Diziler nesnedir. Fonksiyonlar nesnedir. Nesneler nesnedir. Peki nesneler nedir? Nesneler, ad-değer (name-value) çiftlerinden oluşan koleksiyonlardr. Adlar string'tir, değerler ise string, number, boolean ve nesne (dizi ve fonksiyonlar da dahil) olabilir. Nesneler genellikle hashtable olarak uygulanır, böylece değerler hızlı bir şekilde alınabilir.

Eğer bir değer fonksiyon ise, bunu bir *metot* olarak sayabiliriz. Bir nesnenin metodu çağrıldığında `this` değişkenine o nesne atanır. Bu metot daha sonra `this` değişkeni aracılığıyla örnekteki diğer değişkenlere erişebilir.

Nesneler, nesneleri başlatan fonksiyonlar olan *yapıcılar (constructor)* tarafından oluşturulabilir. Yapıcılar, statik değişkenler ve metodlar dahil olmak üzere sınıfların diğer dillerde sağladığı özellikleri sağlar.

### Genel (Public)

Bir nesnenin üyelerinin tümü *genel* üyelerdir. Herhangi bir fonksiyon bu üyelere erişebilir, bunları değiştirebilir veya silebilir ya da yeni üyeler ekleyebilir. Bir nesneye yeni üyeleri eklemenin iki ana yolu vardır:

##### Yapıcıda

Bu teknik genellikle genel örnek değişkenlerini (public instance variable) başlatmak için kullanılır. Yapıcının `this` değişkeni, nesneye üye eklemek için kullanılır.

```javascript
function Container(param) {
  this.member = param;
}
```

Yani, yeni bir nesne oluşturursak:

```javascript
var myContainer = new Container('abc');
```

`myContainer.member` üye değişkeninin değeri `'abc'` olacak.

##### Prototipte

Bu teknik genellikle genel metodlar eklemek için kullanılır. Bir üye istendiğinde ve nesnenin kendisinde bulunmadığında, nesnenin yapıcısının `prototype` üyesinden alınır.

```javascript
Container.prototype.stamp = function (string) {
  return this.member + string;
}
```

```javascript
myContainer.stamp('def');
```

Metodu bu şekilde çalıştırdığımızda `'abcdef'` sonucunu döner.

### Özel (Private)

*Özel* üyeler yapıcı tarafından oluşturulur. Yapıcının `var` ile yazılmış sıradan değişkenleri ve parametreleri özel üyeler haline gelir.

```javascript
function Container(param) {
  this.member = param;
  var secret = 3;
  var that = this;
}
```

Buradaki yapıcı üç tane özel örnek değişkeni oluşturuyor: `param`, `secret` ve `that`. Nesneye bağlıdırlar, ancak ne dışarıdan ne de nesnenin kendi genel metodlarından erişilebilirler. Özel metodlar tarafından erişilebilirler. Özel metodlar, yapıcının iç fonksiyonlarıdır.

```javascript
function Container(param) {
  function dec() {
    if (secret > 0) {
      secret -= 1;
      return true;
    } else {
      return false;
    }
  }

  this.member = param;
  var secret = 3;
  var that = this;
}
```

Özel metot `dec`, `secret` örnek değişkenini kontrol ediyor. Eğer sıfırdan büyükse `secret` değişkenini azaltıp `true` dönüyor. Aksi takdirde ise `false` dönüyor. Bu nesneyi üç kullanımla sınırlandırmak için kullanılabilir.

Genel kurala göre bir `that` özel değişkenini tanımlıyoruz. Bu, nesneyi özel metodların erişimine açmak için kullanılır. İç fonksiyonlar için `this` değerinin yanlış ayarlanmasına neden olan ECMAScript Dil Spesifikasyon'undaki bir hata için geçici bir çözüm olarak bu uygulanır.

Özel metodlar, genel metodlar tarafından çağrılamazlar. Özel metodları kullanışlı hale getirmek için ayrıcalıklı yöntemleri (privileged method) uygulamamız gerekiyor.

### Ayrıcalıklı (Privileged)

*Ayrıcalıklı* bir metot, özel değişkenlere ve metodlara erişebilir ve kendisi de genel metodlara ve dışarıya açıktır. Ayrıcalıklı bir metodu silmek veya yenisiyle değiştirmek mümkündür, ancak onun içeriğini değiştirmek veya sırlarını açmaya zorlamak mümkün değildir.

Ayrıcalıklı metodlar, yapıcının içinde `this` ile atanır.

```javascript
function Container(param) {
  function dec() {
    if (secret > 0) {
      secret -= 1;
      return true;
    } else {
      return false;
    }
  }

  this.member = param;
  var secret = 3;
  var that = this;

  this.service = function () {
    return dec() ? that.member : null;
  };
}
```

`service` metodu ayrıcalıklı bir metottur. `myContainer.service()` metodu çağrıldığı ilk üç seferde `'abc'` dönecektir. Ondan sonra ise `null` dönecek. `service` metodu, özel `secret` değişkenine erişen özel `dec` metodunu çağırır. `service` metodu diğer nesne ve metodlara açıktır, ancak özel üyelere direkt erişime izin vermez.

### Kapanımlar (Closures)

Bu genel, özel ve ayrıcalıklı üye kalıplarını uygulamak JavaScript'in *kapanımlar (closures)* özelliği sayesinde mümkündür. Bunun anlamı, bir iç fonksiyonun, dış fonksiyon bir değer geri döndükten sonra bile, dış fonksiyonunu değişkenlerine ve parametrelerine her zaman erişimi olmasıdır. Dilin son derece güçlü bir özelliğidir bu. Bu, [How JavaScript Works](https://www.howjavascriptworks.com/) kitabında açıklanmıştır.

Özel ve ayrıcalıklı üyeler sadece bir nesne başlatıldığında oluşturulabilir. Genel üyeler ise herhangi bir zamanda eklenebilir.

### Kalıplar

##### Genel

```javascript
function Constructor(...) {
  this.membername = value;
}

Constructor.prototype.membername = value;
```

##### Özel

```javascript
function Constructor(...) {
  var that = this;
  var membername = value;
  function membername(...) {...}
}
```

Not: Aşağıdaki fonksiyon ifadesi

```javascript
function membername(...) {...}
```

bunun bir kısaltmasıdır:

```javascript
var membername = function membername(...) {...};
```

##### Ayrıcalıklı

```javascript
function Constructor(...) {
  this.membername = function (...) {...};
}
```

---

Bu, [Douglas Crockford](http://www.crockford.com)'un [Private Members in JavaScript](http://www.crockford.com/javascript/private.html) adlı orijinal yazısının çevirisidir.
