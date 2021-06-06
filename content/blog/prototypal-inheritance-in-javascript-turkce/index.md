---
title: Prototypal Inheritance in JavaScript, Türkçe
date: "2021-06-06T13:10:55.284Z"
description: Douglas Crockford'un Prototypal Inheritance in JavaScript adlı yazısının Türkçe çevirisi.
---

Beş yıl önce [JavaScript'te Klasik Kalıtımı](http://www.crockford.com/javascript/inheritance.html)([İtalyanca](http://eineki.wordpress.com/2009/10/13/ereditarieta-classica-in-javascript/)) yazdım. JavaScript'in sınıfsız, prototip bir dil olduğunu ve klasik bir sistemi simüle etmek için yeterli ifade gücüne sahip olduğunu anlatıyordu. Programlama stilim o zamandan beri iyi bir programcının yapması gerektiği gibi gelişti. Prototipalizmi tamamen benimsemeyi öğrendim ve kendimi klasik modelin sınırlarından kurtardım.

Yolculuğum dolambaçlıydı çünkü JavaScript'in kendisi prototip doğasına çelişkiliydi. Prototip bir sistemde, nesneler nesnelerden kalıtlanır (inherit). Ancak JavaScript, bu işlemi gerçekleştiren bir operatörden yoksundur.

Onun yerine `new` operatörü vardır. Örnek olarak:

```javascript
new f()
```
yaparak

```javascript
f.prototype
```
nesnesinden kalıtlanan yeni bir nesne oluşturulabilir.

Bu yanıltmayla, klasik (classically) dilleri bilen programcılara JavaScript'in daha tanıdık hale getirilmesi amaçlanıyordu, ancak Java programcılarının JavaScript hakkında sahip olduğu çok olumsuz görüşten de görebileceğimiz gibi, bu başarılamadı. JavaScript'in kurucu (constructor) kalıbı klasik tayfaya hitap etmedi. Ayrıca JavaScript'in gerçek prototip doğasını da gizlemiş oldu. Sonuç olarak, dili etkili bir şekilde kullanmayı bilen çok az programcı var.

Neyse ki, gerçek prototip kalıtımı (inheritance) uygulayan bir operatör oluşturmak kolaydır. Bu, araç setimde standart bir özelliktir ve sizinki için de şiddetle tavsiye ederim.

```javascript
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

Yukarıdaki `object` fonksiyonu, JavaScript'in kurucu kalıbı (constructor pattern) sorununu çözerek gerçek prototip kalıtımı elde eder. Eski bir nesneyi parametre olarak alır ve eski nesneden kalıt alan (inherit) boş bir yeni nesne döndürür. Yeni oluşturduğumuz nesneden bir öğeye erişmeye çalışırsak, ve o öğe yeni nesnede yok ise, eski nesne onu sağlayacaktır. Nesneler, nesnelerden kalıt alır. Bundan daha nesne yönelimli ne olabilir?

Böylece sınıflar oluşturmak yerine prototip nesneler oluşturursunuz ve ardından yeni örnekler oluşturmak için `object` fonksiyonunu kullanırsınız. JavaScript'te nesneler değiştirilebilirdir (mutable), bu nedenle yeni alanlar ve metodlar ekleyerek yeni örnekleri çoğaltabiliriz. Bunlar daha sonra daha yeni nesneler için bile prototip görevi görebilir. Bir sürü benzer nesne oluşturmak için sınıflara ihtiyacımız yok.

Kolaylık sağlamak adına, bizim için `object` fonksiyonunu çağıracak fonksiyonlar oluşturabilir ve yeni nesneleri ayrıcalıklı ([privileged](http://www.crockford.com/javascript/private.html)) metodlarla çoğaltmak gibi diğer özelleştirmeleri sağlayabiliriz. Bazen bunlara *yapıcı* fonksiyonlar adını veririm. Eğer `object` fonksiyonunu çağırmak yerine başka bir yapıcı fonksiyonunu çağıran bir yapıcı fonksiyonumuz varsa, o zaman bir *parazit* kalıtım (parasitic inheritance) kalıbımız var demektir.

JavaScript'in lambda fonksiyonlarını ve template strings ile birlikte bu araçları kullanarak, büyük, karmaşık ve verimli, iyi yapılandırılmış programlar yazabileceğimin farkına vardım. Klasik nesne modeli bugün açık ara en popüler olanıdır, ancak prototip nesne modelinin daha fazla kabiliyete sahip olduğunu ve daha fazla ifade gücü sunduğunu düşünüyorum.

Bu yeni kalıpları öğrenmek de beni daha iyi bir klasik (sınıf modelinde) programcı yaptı. Dinamik dünyadan içgörüler statikte fayda sağlar. 

2006-06-07

Başka bir formülasyon:

```javascript
Object.prototype.begetObject = function () {
  function F() {}
  F.prototype = this;
  return new F();
};

newObject = oldObject.begetObject();
```

2007-04-02

`object` fonksiyonuyla ilgili sorun, global olması ve globallerin açıkça sorunlu olmasıdır. `Object.prototype.begetObject` ile ilgili sorun, beceriksiz programların oluşumunu tetiklemesidir, ve `begetObject` ezildiğinde beklenmeyen sonuçlar üretebilir.

O yüzden şimdi bu formülasyonu tercih ediyorum:

```javascript
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}
newObject = Object.create(oldObject);
```

2008-04-07

---

Bu, [Douglas Crockford](http://www.crockford.com)'un [Prototypal Inheritance in JavaScript](http://www.crockford.com/javascript/prototypal.html) adlı orijinal yazısının çevirisidir.
