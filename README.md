# 2 wersje formularza
1. Ta zakomentowana używa Materiala, mogą być z nią problemy, aplikacja chyba nie jest przygotowana na takie eksperymenty.
 - Brak jest także chyba styli dla formularza materialowego. - np. @import '~@angular/material/prebuilt-themes/indigo-pink.css';
 - No i gdybyśmy użyli styli tych mogłoby to mieć wpływ na resztę aplikacji.
2. Ta nie zakomntowana to prosty formularz z inputami. Nie korzysta z dobroci Material Form Fields. Nie ma też placeholdera.
   - dodalem proste stylowanie dla pól i etykiet - trzeba sprawdzić, czy choć trochę wygląda jak te pozostałe w aplikacji.
# formularz
 w chwili obecnej formularz AbcForm nie ma żadnej walidacji, nawet required - choć nie wiem, czy to konieczne
# dane emitowane z formularza do głownego komponentu 
  //tu otrzymujemy dane z formularza w postaci tablicy
  public abcFormChange(formData: AbcData[]): void {
    console.log(formData);
  }
  Tu trzeba by pewnie wrzucić je do głównego modelu danych (?)
są w takiej postaci
[
    {
        "id": "",
        "firstname": "aaa",
        "lastname": "bbb"
    },
    {
        "id": "",
        "firstname": "ccc",
        "lastname": "ddd"
    }
]
