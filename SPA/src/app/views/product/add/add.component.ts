import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/_core/_services/alertify.service';
import { ProductCategoryService } from 'src/app/_core/_services/product-category.service';
import { ProductService } from 'src/app/_core/_services/product.service';
import { SweetAlertService } from 'src/app/_core/_services/sweet-alert.service';
import { commonPerFactory } from 'src/environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  product: any = {};
  flag = '0';
  productCateList: Array<Select2OptionData>;
  fileImages: File[] = [];
  fileVideos: File[] = [];
  urlImage = commonPerFactory.imageUrl;
  urlVideo = commonPerFactory.videoUrl;
  linkFileImage: string[] = [];
  linkFileVideo: string[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit() {
    this.productService.currentProduct.subscribe(product => {
      this.product = product;
      if (this.product.fileImages != null)
        this.linkFileImage = this.product.fileImages.split(';');

      // ***Here is the code for converting "image source" (url) to "Base64".***
      this.linkFileImage.forEach(element => {
        if (element !== '') {
          let url = this.urlImage + element;
          const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            }));

          // *** Calling both function ***
          toDataURL(url).then(dataUrl => {
            var fileData = dataURLtoFile(dataUrl, element);
            this.fileImages.push(fileData);
          });

          // ***Here is code for converting "Base64" to javascript "File Object".***
          function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
          }
        }
      });

      if (this.product.fileVideos != null)
        this.linkFileVideo = this.product.fileVideos.split(';');

      // ***Here is the code for converting "video source" (url) to "Base64".***
      this.linkFileVideo.forEach(element => {
        if (element !== '') {
          let url = this.urlVideo + element;
          const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            }));

          // *** Calling both function ***
          toDataURL(url).then(dataUrl => {
            var fileData = dataURLtoFile(dataUrl, element);
            this.fileVideos.push(fileData);
          });

          // ***Here is code for converting "Base64" to javascript "File Object".***
          function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
          }
        }
      });
    }).unsubscribe();
    this.productService.currentFlag.subscribe(flag => this.flag = flag).unsubscribe();
    if (this.flag === '0') {
      this.cancel();
    }
    if (this.flag === '1') {
      if (this.product.new === true)
        this.product.new = '1';
      else
        this.product.new = '0';

      if (this.product.hot_Sale === true)
        this.product.hot_Sale = '1';
      else
        this.product.hot_Sale = '0';

      if (this.product.isSale === true)
        this.product.isSale = '1';
      else
        this.product.isSale = '0';

      if (this.product.status === true)
        this.product.status = '1';
      else
        this.product.status = '0';
    }
    this.getProductCateList();
  }

  backList() {
    this.router.navigate(['/product']);
  }

  saveAndNext() {
    this.checkNew();
    this.checkHotSale();
    this.checkIsSale();
    this.checkStatus();
    this.productService.create(this.product, this.fileImages, this.fileVideos).subscribe(res => {
      if (res.success) {
        this.sweetAlert.success('Success!', res.message);
        this.cancel();
      }
      else {
        this.sweetAlert.error('Error!', res.message);
      }
    },
      error => {
        console.log(error);
      });
  }

  save() {
    this.checkNew();
    this.checkHotSale();
    this.checkIsSale();
    this.checkStatus();
    if (this.flag === '0') {
      this.productService.create(this.product, this.fileImages, this.fileVideos).subscribe(res => {
        if (res.success) {
          this.sweetAlert.success('Success!', res.message);
          this.backList();
        }
        else {
          this.sweetAlert.error('Error!', res.message);
        }
      },
        error => {
          console.log(error);
        });
    }
    else {
      this.productService.update(this.product, this.fileImages, this.fileVideos).subscribe(res => {
        if (res.success) {
          this.sweetAlert.success('Success!', res.message);
          this.backList();
        }
        else {
          this.sweetAlert.error('Error!', res.message);
        }
      },
        error => {
          console.log(error);
        });
    }
  }

  checkNew() {
    if (this.product.new === '1')
      this.product.new = true;
    if (this.product.new === '0')
      this.product.new = false;
  }

  checkHotSale() {
    if (this.product.hot_Sale === '1')
      this.product.hot_Sale = true;
    if (this.product.hot_Sale === '0')
      this.product.hot_Sale = false;
  }

  checkIsSale() {
    if (this.product.isSale === '1')
      this.product.isSale = true;
    if (this.product.isSale === '0')
      this.product.isSale = false;
  }

  checkStatus() {
    if (this.product.status === '1')
      this.product.status = true;
    if (this.product.status === '0')
      this.product.status = false;
  }

  cancel() {
    this.product.product_Name = this.product.content = this.product.from_Date_Sale = this.product.to_Date_Sale = '';
    this.product.new = this.product.hot_Sale = this.product.isSale = '0';
    this.product.status = '1';
    this.product.price = this.product.discount = this.product.time_Sale = this.product.amount = 0;
    this.fileImages = [];
    this.fileVideos = [];
  }

  getProductCateList() {
    this.productCategoryService.getIdAndName().subscribe(res => {
      this.productCateList = res.map(item => {
        return { id: item.id, text: item.name };
      });
      if (res.length > 0 && this.flag === '0') {
        this.product.product_Cate_ID = this.productCateList[0].id;
      }
    });
  }

  changeIsSale(event) {
    this.product.isSale = event;
    this.clearTimeAndDaySale();
  }

  clearTimeAndDaySale() {
    this.product.time_Sale = 0;
    this.product.from_Date_Sale = this.product.to_Date_Sale = '';
  }

  // Dropzone import multi file images or videos
  onSelectImages(event) {
    this.fileImages.push(...event.addedFiles);
    console.log('select: ', this.fileImages);
  }

  onRemoveImages(event) {
    this.fileImages.splice(this.fileImages.indexOf(event), 1);
    console.log('delete: ', this.fileImages);
  }

  onSelectVideos(event) {
    this.fileVideos.push(...event.addedFiles);
    console.log('select: ', this.fileVideos);
  }

  onRemoveVideos(event) {
    this.fileVideos.splice(this.fileVideos.indexOf(event), 1);
    console.log('delete: ', this.fileVideos);
  }
}
